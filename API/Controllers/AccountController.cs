using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace API.Controllers
{
    [AllowAnonymous]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        public AccountController(UserManager<User> userManager,
            SignInManager<User> signInManager, TokenService tokenService,
            IConfiguration config)
        {
            this._config = config;
            this._tokenService = tokenService;
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
        }

        [HttpPost("login", Name = "Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this._userManager.Users.Include(user => user.Photos)
                .FirstOrDefaultAsync(user => user.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await this._signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [HttpPost("register", Name = "Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = await this._userManager.FindByEmailAsync(registerDto.Email);

            if (user != null)
            {
                ModelState.AddModelError("email", "Email Already Taken");
                return ValidationProblem();
            }

            if (user.UserName == registerDto.UserName)
            {
                ModelState.AddModelError("userName", "Username Already Taken");
                return ValidationProblem();
            }

            var newUser = new User
            {
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.UserName
            };

            var result = await this._userManager.CreateAsync(newUser, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(newUser);
            }
            return BadRequest("Problem Registering User");
        }

        [Authorize]
        [HttpGet(Name = "GetCurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await this._userManager.Users.Include(user => user.Photos)
                .FirstOrDefaultAsync(user => user.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var fbVerifyKeys = this._config["Facebook:AppId"] + "|" + this._config["Facebook:SecretKey"];

            //verifying the access token
            var verifyToken = await this._httpClient
                .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

            if (!verifyToken.IsSuccessStatusCode) return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

            var response = await this._httpClient.GetAsync(fbUrl);

            if (!response.IsSuccessStatusCode) return Unauthorized();

            var content = await response.Content.ReadAsStringAsync();

            var fbInfo = JsonConvert.DeserializeObject<dynamic>(content);

            var username = (string)fbInfo.id;
            var user = await this._userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == username);

            if (user != null) return CreateUserObject(user);

            user = new User
            {
                DisplayName = (string)fbInfo.name,
                Email = (string)fbInfo.email,
                UserName = username,
                Photos = new List<Photo>
                {
                    new Photo
                    {
                        Id = "fb_" + (string) fbInfo.id,
                        Url = (string) fbInfo.picture.data.url,
                        IsMain = true
                    }
                }
            };

            var result = await this._userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem creating user account");

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(User user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = this._tokenService.CreateToken(user),
                Username = user.UserName,
                Image = user?.Photos?.FirstOrDefault(photo => photo.IsMain)?.Url
            };
        }
    }
}
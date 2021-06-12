using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}", Name = "Follow")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowingToggle.Command { TargetUsername = username }));
        }

        [HttpGet("{username}", Name = "GetFollowings")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(
                new List.Query { Username = username, Predicate = predicate }));
        }
    }
}
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}", Name = "GetUserProfile")]
        public async Task<ActionResult> GetUserProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpGet("{username}/activities", Name = "GetProfileActivities")]
        public async Task<IActionResult> GetProfileActivities(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(
                new ListActivities.Query { Username = username, Predicate = predicate }));
        }
    }
}
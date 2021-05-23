using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using System.Collections.Generic;
using Application.Activities;

namespace API.Controllers
{
    ///<summary>Controller that contains logic to map activity apis with 
    ///respective query or command statement</summary>
    public class ActivitiesController : BaseApiController
    {

        [HttpGet(Name = "GetAllActivities")]
        public async Task<ActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}", Name = "GetActivityById")]
        public async Task<ActionResult> GetActivities(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost(Name = "CreateActivity")]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { activity = activity }));
        }

        [HttpPut("{id}", Name = "UpdateActivity")]
        public async Task<IActionResult> UpdateActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Update.Command { activity = activity }));
        }

        [HttpDelete("{id}", Name = "DeleteActivity")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}
using System.Linq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

namespace Application.Activities
{
    /// <summary>
    /// Class handles three senarios
    /// 1) If attendee is host and hit this handler than event will be cancled
    /// 2) If attendee is not host and has not went to this event 
    /// and hit this handler than the attendee will be added to the event attendee list
    /// 3) If attendee is not host and is going to this event 
    /// and hit this handler than the attendee will be removed from the event attendee list 
    /// </summary>
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.User)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                var user = await this._context.Users
                    .FirstOrDefaultAsync(x => x.UserName == this._userAccessor.GetUserName());

                if (user == null) return null;

                string username = user.UserName;

                var hostUserName = activity.Attendees.FirstOrDefault(x => x.IsHost).User.UserName;

                var attendance = activity.Attendees
                    .FirstOrDefault(x => x.User.UserName == username);

                //activate or cancel activity based on previous value
                if (attendance != null && hostUserName == username)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                if (attendance != null && hostUserName != username)
                {
                    activity.Attendees.Remove(attendance);
                }

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        User = user,
                        Activitiy = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await this._context.SaveChangesAsync() > 0;

                return result ?
                        Result<Unit>.Success(Unit.Value) :
                        Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}
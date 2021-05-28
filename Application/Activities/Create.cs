using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interface;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    ///<summary>This class handles the business logic to create activity and save it to database</summary>
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity activity { get; set; }
        }

        /// <summary>
        /// Validator class to validate create record request
        /// </summary>
        public class CreateValidator : AbstractValidator<Command>
        {
            public CreateValidator()
            {
                RuleFor(x => x.activity).SetValidator(new ActivityValidator());
            }
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
                var user = await this._context.Users.FirstOrDefaultAsync(
                    x => x.UserName == this._userAccessor.GetUserName());

                var newAttendee = new ActivityAttendee
                {
                    User = user,
                    Activitiy = request.activity,
                    IsHost = true
                };

                request.activity.Attendees.Add(newAttendee);

                //adding data to memory
                this._context.Activities.Add(request.activity);

                //saving data in database
                var result = await this._context.SaveChangesAsync() > 0;

                /*
                    we need to return this as it indicated that our request/response 
                    for specific api is complete
                */
                if (!result) return Result<Unit>.Failure("Falied to create activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
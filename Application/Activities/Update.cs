using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    ///<summary>This class handles the business logic to update activity and save it to database</summary>
    public class Update
    {
        public class Command : IRequest<ResultHandler<Unit>>
        {
            public Activity activity { get; set; }
        }

        /// <summary>
        /// Validator class to validate update record request
        /// </summary>
        public class UpdateValidator : AbstractValidator<Command>
        {
            public UpdateValidator()
            {
                RuleFor(x => x.activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, ResultHandler<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<ResultHandler<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity act = await this._context.Activities.FindAsync(request.activity.Id);

                if (act == null) return null;

                MappingProfiles<Activity>.map(act, request.activity);
                var result = await this._context.SaveChangesAsync() > 0;

                if (!result) return ResultHandler<Unit>.Failure("Failed to update the activity");

                return ResultHandler<Unit>.Success(Unit.Value);
            }
        }
    }
}
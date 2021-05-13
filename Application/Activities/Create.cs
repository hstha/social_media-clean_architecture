using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    ///<summary>This class handles the business logic to create activity and save it to database</summary>
    public class Create
    {
        public class Command : IRequest<ResultHandler<Unit>>
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

        public class Handler : IRequestHandler<Command, ResultHandler<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<ResultHandler<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //adding data to memory
                this._context.Activities.Add(request.activity);

                //saving data in database
                var result = await this._context.SaveChangesAsync() > 0;

                /*
                    we need to return this as it indicated that our request/response 
                    for specific api is complete
                */
                if (!result) return ResultHandler<Unit>.Failure("Falied to create activity");

                return ResultHandler<Unit>.Success(Unit.Value);
            }
        }
    }
}
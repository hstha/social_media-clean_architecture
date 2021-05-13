using System;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    ///<summary>Holds the logic to delete activity</summary>
    public class Delete
    {
        public class Command : IRequest<ResultHandler<Unit>>
        {
            public Guid Id { get; set; }
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
                Activity activity = await this._context.Activities.FindAsync(request.Id);

                if (activity == null) return null;

                this._context.Remove(activity);
                var result = await this._context.SaveChangesAsync() > 0;

                if (!result) return ResultHandler<Unit>.Failure("Couldn't delete the activity");

                return ResultHandler<Unit>.Success(Unit.Value);
            }
        }
    }
}
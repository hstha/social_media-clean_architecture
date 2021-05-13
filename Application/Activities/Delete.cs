using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    ///<summary>Holds the logic to delete activity</summary>
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await this._context.Activities.FindAsync(request.Id);
                this._context.Remove(activity);
                await this._context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}
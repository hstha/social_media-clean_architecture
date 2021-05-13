using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
  ///<summary>This class handles the business logic to update activity and save it to database</summary>
  public class Update
    {
        public class Command : IRequest
        {
            public Activity activity { get; set; }
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
                Activity act = await this._context.Activities.FindAsync(request.activity.Id);
                MappingProfiles<Activity>.map(act, request.activity);
                await this._context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
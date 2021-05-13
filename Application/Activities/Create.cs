using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    ///<summary>This class handles the business logic to create activity and save it to database</summary>
    public class Create
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
                //adding data to memory
                this._context.Activities.Add(request.activity);

                //saving data in database
                await this._context.SaveChangesAsync();

                /*
                    we need to return this as it indicated that our request/response 
                    for specific api is complete
                */
                return Unit.Value;
            }
        }
    }
}
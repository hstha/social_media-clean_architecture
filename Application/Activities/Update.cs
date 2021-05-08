using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
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
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this._mapper = mapper;
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity act = await this._context.Activities.FindAsync(request.activity.Id);
                this._mapper.Map(request.activity, act);
                await this._context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
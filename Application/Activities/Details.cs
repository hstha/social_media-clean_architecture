using System;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    ///<summary>This class handles the business logic to list single activity</summary>
    public class Details
    {
        public class Query : IRequest<ResultHandler<Activity>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultHandler<Activity>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<ResultHandler<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return ResultHandler<Activity>.Success(await this._context.Activities.FindAsync(request.Id));
            }
        }
    }
}
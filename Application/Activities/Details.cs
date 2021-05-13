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
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<Activity>.Success(await this._context.Activities.FindAsync(request.Id));
            }
        }
    }
}
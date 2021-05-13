using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    ///<summary>This class handles the business logic to list the list of activities</summary>
    public class List
    {
        ///<summary>Used to query Activities</summary>
        public class Query : IRequest<ResultHandler<List<Activity>>> { }

        public class Handler : IRequestHandler<Query, ResultHandler<List<Activity>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<ResultHandler<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return ResultHandler<List<Activity>>.Success(await this._context.Activities.ToListAsync());
            }
        }
    }
}
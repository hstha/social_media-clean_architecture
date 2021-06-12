using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interface;
using Application.Profiles;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profile>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly AutoMapper.IMapper _mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, AutoMapper.IMapper mapper)
            {
                this._mapper = mapper;
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Result<List<Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profile>();

                if (request.Predicate == "followers")
                {
                    profiles = await this._context.UserFollowings
                        .Where(x => x.Target.UserName == request.Username)
                        .Select(u => u.Observer)
                        .ProjectTo<Profile>(this._mapper.ConfigurationProvider,
                            new { currentUsername = this._userAccessor.GetUserName() })
                        .ToListAsync();

                }
                else if (request.Predicate == "following")
                {
                    profiles = await this._context.UserFollowings
                        .Where(x => x.Observer.UserName == request.Username)
                        .Select(u => u.Target)
                        .ProjectTo<Profile>(this._mapper.ConfigurationProvider,
                            new { currentUsername = this._userAccessor.GetUserName() })
                        .ToListAsync();
                }

                return Result<List<Profile>>.Success(profiles);
            }
        }
    }
}
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._photoAccessor = photoAccessor;
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await this._context.Users.Include(user => user.Photos)
                    .FirstOrDefaultAsync(user => user.UserName == this._userAccessor.GetUserName());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(photo => photo.Id == request.Id);

                if (photo == null) return null;

                var currentMainPhoto = user.Photos.FirstOrDefault(photo => photo.IsMain);
                if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

                photo.IsMain = true;

                var result = await this._context.SaveChangesAsync() > 0;

                if (result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Unable to set main photo");
            }
        }
    }
}
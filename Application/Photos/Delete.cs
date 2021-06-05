using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interface;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
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

                if (photo.IsMain) return Result<Unit>.Failure("Cannot delete your main photo");

                var result = await this._photoAccessor.DeletePhoto(photo.Id);

                if (result == null) return Result<Unit>.Failure("Unable to delete photo from cloudinary");

                user.Photos.Remove(photo);

                var success = await this._context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Unable to delete the photo");
            }
        }
    }
}
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDTO>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDTO>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                this._mapper = mapper;
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Result<CommentDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities.FindAsync(request.ActivityId);

                if (activity == null) return null;

                var user = await this._context.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(x => x.UserName == this._userAccessor.GetUserName());

                var comment = new Comment
                {
                    Body = request.Body,
                    Author = user,
                    Activity = activity
                };

                activity.Comments.Add(comment);

                var result = await this._context.SaveChangesAsync() > 0;

                if (result) return Result<CommentDTO>.Success(this._mapper.Map<CommentDTO>(comment));

                return Result<CommentDTO>.Failure("Failed to add comment");
            }
        }
    }
}
using System.Linq;
using Application.DTOs;
using AutoMapper;
using Domain;

namespace Application.core
{
    public class ProfileMapper : Profile
    {
        public ProfileMapper()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(destObj => destObj.HostUsername,
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).User.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
                .ForMember(user => user.Image, o => o.MapFrom(s => s.User.Photos.FirstOrDefault(photo => photo.IsMain).Url));

            CreateMap<User, Profiles.Profile>()
                .ForMember(user => user.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(photo => photo.IsMain).Url));

            CreateMap<Comment, CommentDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(user => user.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(photo => photo.IsMain).Url));

        }
    }
}
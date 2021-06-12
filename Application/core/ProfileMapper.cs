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
            string currentUsername = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(destObj => destObj.HostUsername,
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).User.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
                .ForMember(user => user.Image, o =>
                    o.MapFrom(s => s.User.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(p => p.FollowersCount, o => o.MapFrom(s => s.User.Followers.Count))
                .ForMember(p => p.FollowingCount, o => o.MapFrom(s => s.User.Following.Count))
                .ForMember(p => p.IsFollowing, o =>
                    o.MapFrom(s => s.User.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<User, Profiles.Profile>()
                .ForMember(p => p.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(p => p.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(p => p.FollowingCount, o => o.MapFrom(s => s.Following.Count))
                .ForMember(p => p.IsFollowing, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(user => user.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(photo => photo.IsMain).Url));

        }
    }
}
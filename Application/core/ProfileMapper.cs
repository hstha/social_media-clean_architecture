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

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio));
        }
    }
}
using System.Diagnostics;
using AutoMapper;

namespace Application.core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
        }
    }
}
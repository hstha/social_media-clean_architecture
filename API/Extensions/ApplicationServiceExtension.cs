using Application.Activities;
using Application.core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtension
    {
        ///<summary>This method contains the additional services need for application to run</summary>
        ///<remarks>This methods is just for housekeeping purpose.</remarks>
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services, 
            IConfiguration config
        )
        {
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            //added database interface service controller
            services.AddDbContext<DataContext>(opt => {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            //added cors so that we can accept data from different domain
            services.AddCors(opt => {
                opt.AddPolicy("MyCorsPolicy", policy => {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            //adding mediator as service
            //adding handler for Activities.List
            //This decides which Activity handler should be invoked when activity related api is called
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;
        }
    }
}
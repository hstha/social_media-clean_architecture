using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    ///<summary> Class <c>DataContext</c> instance represents a session with 
    ///the database and can be used to query and save instances of your entities</summary>
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.UserId, aa.ActivityId }));

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.User)
                .WithMany(u => u.Activities)
                .HasForeignKey(key => key.UserId);

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.Activitiy)
                .WithMany(u => u.Attendees)
                .HasForeignKey(key => key.ActivityId);

            /*
                - On Comment if there is one Activity with one or many Comments 
                than on deleting that Activity delete all the related comments 
            */
            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
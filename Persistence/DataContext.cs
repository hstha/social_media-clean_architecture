using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    ///<summary> Class <c>DataContext</c> instance represents a session with 
    ///the database and can be used to query and save instances of your entities</summary>
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activity { get; set; }
    }
}
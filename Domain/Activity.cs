using System;

namespace Domain {
    /// <summary> Class <c>Activity</c> represents a  table of database.</summary>
    /// <remarks> Contains properties realted to activity done in a post.</remarks>
    public class Activity {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}
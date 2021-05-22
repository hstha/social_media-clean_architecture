using System;

namespace Domain
{
    public class ActivityAttendee
    {
        public Guid ActivityId { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public Activity Activitiy { get; set; }
        public bool IsHost { get; set; }
    }
}
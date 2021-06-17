using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models
{
    public partial class UserTask
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Description { get; set; }
        public string Note { get; set; }
        public string ElapsedTime { get; set; }
        public string SolvingType { get; set; }
        public int UserId { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }

        public virtual Priority Priority { get; set; }
        public virtual Status Status { get; set; }
        public virtual User User { get; set; }
    }
}

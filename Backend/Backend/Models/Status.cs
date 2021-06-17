using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models
{
    public partial class Status
    {
        public Status()
        {
            UserTasks = new HashSet<UserTask>();
        }

        public int StatusId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<UserTask> UserTasks { get; set; }
    }
}

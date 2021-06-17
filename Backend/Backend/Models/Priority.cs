using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models
{
    public partial class Priority
    {
        public Priority()
        {
            UserTasks = new HashSet<UserTask>();
        }

        public int PriorityId { get; set; }
        public string Priority1 { get; set; }

        public virtual ICollection<UserTask> UserTasks { get; set; }
    }
}

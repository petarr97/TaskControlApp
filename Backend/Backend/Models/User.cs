using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models
{
    public partial class User
    {
        public User()
        {
            UserTasks = new HashSet<UserTask>();
        }

        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public virtual ICollection<UserTask> UserTasks { get; set; }
    }
}

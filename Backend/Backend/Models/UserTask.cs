using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace Backend.Models
{
    public partial class UserTask
    {
        public int TaskId { get; set; }
        [Required]
        [MaxLength(100)]
        [MinLength(5)]
        public string Name { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Required]
        [MaxLength(500)]
        [MinLength(10)]
        public string Description { get; set; }
        [Required]
        [MaxLength(200)]
        [MinLength(10)]
        public string Note { get; set; }
        public string ElapsedTime { get; set; }
        [MaxLength(500)]
        public string SolvingType { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public int PriorityId { get; set; }

        public virtual Priority Priority { get; set; }
        public virtual Status Status { get; set; }
        public virtual User User { get; set; }
    }
}

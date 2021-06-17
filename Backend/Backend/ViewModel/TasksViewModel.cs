using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.ViewModel
{
    public class TasksViewModel
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Description { get; set; }
        public string Note { get; set; }
        public string ElapsedTime { get; set; }
        public string SolvingType { get; set; }
        public int User { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
    }
}

using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class CodebookService
    {
        TaskSystemDBContext _context;
        public CodebookService(TaskSystemDBContext context)
        {
            _context = context;
        }
        public IEnumerable<CodebookModel> GetAllStatuses()
        {
            var result = (from stat in _context.Statuses
                          select new CodebookModel
                          {
                              Id = stat.StatusId,
                              Value = stat.Name
                          });
            return result;
        }
        public IEnumerable<CodebookModel> GetAllPriorities()
        {
            var result = (from priority in _context.Priorities
                          select new CodebookModel
                          {
                              Id = priority.PriorityId,
                              Value = priority.Priority1
                          });
            return result;
        }

    }
}

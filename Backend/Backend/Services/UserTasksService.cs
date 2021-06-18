using Backend.Interfaces;
using Backend.Models;
using Backend.ViewModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class UserTasksService : ITasks
    {
        private TaskSystemDBContext _context;
        public UserTasksService(TaskSystemDBContext context)
        {
            this._context = context;
        }
        public int AddTask(UserTask newUserTask)
        {
            this._context.UserTasks.Add(newUserTask);
            this._context.SaveChanges();
            return newUserTask.TaskId;
        }

        public void DeleteTask(int id)
        {
            throw new NotImplementedException();
        }
        public UserTask GetTask(int id)
        {
            var result = _context.UserTasks.Where(task=>task.TaskId == id).FirstOrDefault();
            return result;
        }

        public void UpdateTask(int id, UserTask userTask)
        {

            _context.Entry(userTask).State = EntityState.Modified;

            try
            {
                 _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException e)
            {
            }
        }

        IEnumerable<TasksViewModel> ITasks.GetAllTasks(int userID)
        {
            var result = (from ut in _context.UserTasks
                          join stat in _context.Statuses on ut.StatusId equals stat.StatusId
                          join priority in _context.Priorities on ut.PriorityId equals priority.PriorityId
                          where ut.UserId == userID
                          select new TasksViewModel
                          {
                              Description = ut.Description,
                              Note = ut.Note,
                              ElapsedTime = ut.ElapsedTime,
                              Name = ut.Name,
                              EndDate = ut.EndDate.ToString(),
                              Priority = priority.Priority1,
                              SolvingType = ut.SolvingType,
                              StartDate = ut.StartDate,
                              Status = stat.Name,
                              TaskId = ut.TaskId,
                              User = ut.UserId
                          }).ToList();
            return result;
        }
        private bool UserTaskExists(int id)
        {
            return _context.UserTasks.Any(e => e.TaskId == id);
        }

    }
}

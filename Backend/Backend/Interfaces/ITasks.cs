using Backend.Models;
using Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface ITasks
    {
        int AddTask(UserTask newUserTask);
        TasksViewModel GetTask(int id);
        IEnumerable<TasksViewModel> GetAllTasks(int userID);
        void DeleteTask(int id);
        void UpdateTask(UserTask userTask);
    }
}

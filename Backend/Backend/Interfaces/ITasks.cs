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
        UserTask GetTask(int id);
        IEnumerable<TasksViewModel> GetAllTasks(int userID);
        void DeleteTask(int id);
        void UpdateTask(int id,UserTask userTask);
    }
}

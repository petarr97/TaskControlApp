using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IUser
    {
        ServiceResponseModel AddUser(RegisterUser newUser);
        User GetUser(int id);
        IEnumerable<User> GetAllUsers();
        void DeleteUser(int id);
        void UpdateUser(User user);
    }
}

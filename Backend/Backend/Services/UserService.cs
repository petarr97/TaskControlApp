using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class UserService : IUser
    {
        TaskSystemDBContext _context;
        public UserService(TaskSystemDBContext context)
        {
            _context = context;
        }
        public ServiceResponseModel AddUser(RegisterUser newUser)
        {

            User existingUser = _context.Users.Where(user => (user.Email == newUser.Email)).FirstOrDefault();

            if (existingUser == null)
            {

                User user = new User() { Email = newUser.Email, 
                                         Password = newUser.Password, 
                                         Name = newUser.Name, 
                                         Surname = newUser.Surname,
                                         PhoneNumber = newUser.PhoneNumber };
                _context.Users.Add(user);
                _context.SaveChanges();
                return new ServiceResponseModel() { error = false, response = user.UserId };
            }
            return new ServiceResponseModel() { error = true, response = null };
        }

        public void DeleteUser(int id)
        {
            throw new NotImplementedException();
        }
        
        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUser(int id)
        {
            throw new NotImplementedException();
        }

        public void UpdateUser(User user)
        {
            throw new NotImplementedException();
        }
    }
}

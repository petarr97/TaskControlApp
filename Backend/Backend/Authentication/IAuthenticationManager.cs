using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Authentication
{
    public interface IAuthenticationManager
    {
        AuthModel Authenticate(string username, string password);
    }
}

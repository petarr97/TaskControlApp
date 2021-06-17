using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using SQLitePCL;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Authentication
{
    public class AuthenticationManager : IAuthenticationManager
    {

        private readonly string key;
        private TaskSystemDBContext _context;
        public AuthenticationManager(string key, TaskSystemDBContext context)
        {
            this.key = key;
            _context = context;
        }
        public AuthModel Authenticate(string email, string password)
        {
            try
            {
                User user = _context.Users.Where(user => (user.Email == email && user.Password == password)).FirstOrDefault();
                if (user == null)
                {
                    return null;
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenKey = Encoding.ASCII.GetBytes(key);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name, email)
                    }),
                    Expires = DateTime.UtcNow.AddHours(24),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey),
                                                                SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                AuthModel authModel = new AuthModel();
                authModel.Name = user.Name;
                authModel.UserId = user.UserId;
                authModel.Token = tokenHandler.WriteToken(token);

                return authModel;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}

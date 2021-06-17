using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Interfaces;
using Backend.ViewModel;
using Backend.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserTasksController : ControllerBase
    {
        private readonly TaskSystemDBContext _context;
        private ITasks _taskService;
        IAuthenticationManager _authenticationManager;

        public UserTasksController(ITasks taskService, IAuthenticationManager authenticationManager)
        {
            _authenticationManager = authenticationManager;
            _taskService = taskService;
        }

        // GET: api/UserTasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TasksViewModel>>> GetUserTasks(int userID)
        {
            IEnumerable<TasksViewModel> taskList = _taskService.GetAllTasks(userID);
            return Ok(taskList);
        }

        // GET: api/UserTasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TasksViewModel>> GetUserTask(int id)
        {
            var userTask = _taskService.GetTask(id);

            if (userTask == null)
            {
                return NotFound();
            }

            return Ok(userTask);
        }

        // PUT: api/UserTasks/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserTask(int id, UserTask userTask)
        {
            if (id != userTask.TaskId)
            {
                return BadRequest();
            }

            _context.Entry(userTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UserTasks
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<UserTask>> PostUserTask(UserTask userTask)
        {
            int taskID = _taskService.AddTask(userTask);

            return CreatedAtAction("GetUserTask", new { id = taskID });
        }

        // DELETE: api/UserTasks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserTask>> DeleteUserTask(int id)
        {
            var userTask = await _context.UserTasks.FindAsync(id);
            if (userTask == null)
            {
                return NotFound();
            }

            _context.UserTasks.Remove(userTask);
            await _context.SaveChangesAsync();

            return userTask;
        }

        private bool UserTaskExists(int id)
        {
            return _context.UserTasks.Any(e => e.TaskId == id);
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserCredentials userCredentials)
        {
            var token = _authenticationManager.Authenticate(userCredentials.Email, userCredentials.Password);
            if (token == null)
                return Unauthorized();
            return Ok();
        }
    }
}

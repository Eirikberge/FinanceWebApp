using Microsoft.AspNetCore.Mvc;
using FinanceWebApp.Server.Data;
using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using Azure.Core;

namespace FinanceWebApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : Controller
	{
		private readonly FinanceAppContext _context;

		public UserController(FinanceAppContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult GetUsers()
		{
			var owners = _context.Users
				.Include(u => u.Trades)
				.Include(u => u.StockHoldings)
				.ToList();
			return Ok(owners);
		}

		[HttpPost] // kun ha denne i auth?
		public async Task<IActionResult> AddUser([FromBody] UserDto user) 
		{
			var newUser = new User()
			{
				Name = user.Name,
				Password = user.Password,
				Capital = 0,
				Trades = new List<Trade>(),
				StockHoldings = new List<StockHolding>(),
		};
			try
			{
				_context.Users.Add(newUser);
				await _context.SaveChangesAsync();
				return Ok();
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpPost("check/{nameCheck}")]
		public async Task<ActionResult<string>> UsernameCheck(string nameCheck)
		{
			if (string.IsNullOrWhiteSpace(nameCheck))
			{
				return BadRequest("Username cannot be empty.");
			}

			var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == nameCheck);

			if (user != null)
			{
				return Ok("Username is taken.");
			}
			else
			{
				return Ok("Username is available.");
			}
		}

	}
	//	{
	//	"id": 2,
	//	"name": "Test",
	//	"password": "test",
	//	"capital": 0,
	//	"trades": [],
	//	"stockHoldings": []
	//}
}


using Microsoft.AspNetCore.Mvc;
using FinanceWebApp.Server.Data;
using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Dtos;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
namespace FinanceWebApp.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : Controller
	{
		private readonly FinanceAppContext _context;
		private readonly IConfiguration _configuration;

		public AuthController(IConfiguration configuration, FinanceAppContext context)
		{
			_configuration = configuration;
			_context = context;
		}


		[HttpPost("register")]
		public async Task<IActionResult> AddUser([FromBody] UserDto user)
		{
			string passwordHash
				= BCrypt.Net.BCrypt.HashPassword(user.Password);
			var newUser = new User()
			{
				Name = user.Name,
				Password = passwordHash,
				Capital = 0,
				Trades = new List<Trade>(),
				StockHoldings = new List<StockHolding>(),
			};
			try
			{
				_context.Users.Add(newUser);
				await _context.SaveChangesAsync();
				return Ok(user);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpPost("login")]
		public async Task<ActionResult<string>> Login([FromBody] UserDto request)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == request.Name);

			if (user == null)
			{
				return BadRequest("User not found.");
			}

			if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
			{
				return BadRequest("Wrong password.");
			}

			string token = CreateToken(user);

			return Ok(token);
		}

		private string CreateToken(User user)
		{
			List<Claim> claims = new List<Claim>
			{
				new Claim("userId", user.Id.ToString()),
				new Claim(ClaimTypes.Name, user.Name),
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
				_configuration.GetSection("Appsettings:Token").Value!));

			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.Now.AddDays(1),
				signingCredentials: creds
				);

			var jwt = new JwtSecurityTokenHandler().WriteToken(token);

			return jwt;
		}
	}
}

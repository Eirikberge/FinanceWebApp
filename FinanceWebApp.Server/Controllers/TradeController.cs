using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Repositories.Contracts;
using FinanceWebApp.Server.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace FinanceWebApp.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TradeController : Controller
	{
		private readonly ITradeRepository _tradeRepository;
		public TradeController(ITradeRepository tradeRepository)
		{
			_tradeRepository = tradeRepository;
		}
		[HttpGet]
		public async Task<IActionResult> GetTrades()
		{
			try
			{
				var trades = await _tradeRepository.GetTrades();
				return Ok(trades);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
		[HttpGet("{id}")]
		public async Task<ActionResult<IEnumerable<Trade>>> GetTradesById(int id)
		{
			try
			{
				var trades = await _tradeRepository.GetTradesById(id);
				return Ok(trades);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpPost]
		public async Task<IActionResult> AddTrade([FromBody] TradeDto tradeDto)
		{
			try
			{
				//var userId = GetUserIdFromSession(); // Når jeg kommer til innlogging
				await _tradeRepository.AddTrade(tradeDto);
				return Ok();
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
	}
}
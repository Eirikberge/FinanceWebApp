using FinanceWebApp.Server.Data;
using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Repositories.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FinanceWebApp.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class StockHoldingController : Controller
	{
		private readonly IStockHoldingRepository _stockHoldingRepository;
		public StockHoldingController(IStockHoldingRepository stockHoldingRepository)
		{
			_stockHoldingRepository = stockHoldingRepository;
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<IEnumerable<StockHolding>>> GetStockHoldingsById(int id)
		{
			try
			{
				var stockHoldings = await _stockHoldingRepository.GetStockHoldingById(id);
				return Ok(stockHoldings);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
	}
}

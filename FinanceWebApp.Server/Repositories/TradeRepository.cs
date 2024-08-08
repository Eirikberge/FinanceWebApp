using FinanceWebApp.Server.Data;
using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Repositories.Contracts;
using FinanceWebApp.Server.Dtos;
using Microsoft.EntityFrameworkCore;

namespace FinanceWebApp.Server.Repositories
{
	public class TradeRepository : ITradeRepository
	{
		private readonly FinanceAppContext _context;

		public TradeRepository(FinanceAppContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<Trade>> GetTrades()
		{
			return await _context.Trades.ToListAsync();
		}
		public async Task<IEnumerable<Trade>> GetTradesById(int id)
		{
			return await _context.Trades
				.Where(t => t.UserId == id)
				.ToListAsync();
		}
		public async Task AddTrade(TradeDto tradeDto)
		{
			if (tradeDto == null)
			{
				throw new ArgumentNullException(nameof(tradeDto), "TradeDto is null");
			}

			var tradeOwnerEntity = await _context.Users.FindAsync(tradeDto.UserId);

			if (tradeOwnerEntity == null)
			{
				throw new Exception($"User with ID {tradeDto.UserId} not found");
			}

			var trade = new Trade
			{
				UserId = tradeDto.UserId,
				StockSymbol = tradeDto.StockSymbol,
				User = tradeOwnerEntity,
				Price = tradeDto.Price,
				Quantity = tradeDto.Quantity,
				TimeStamp = tradeDto.TimeStamp
			};

			tradeOwnerEntity.Trades.Add(trade);

			await _context.SaveChangesAsync();
		}
	}
}
using FinanceApp.Api.Entities;
using FinanceApp.Models.Dtos;

namespace FinanceApp.Api.Repositories.Contracts
{
	public interface ITradeRepository
	{
		Task<IEnumerable<Trade>> GetTrades();
		Task<IEnumerable<Trade>> GetTradesById(int id);
		Task AddTrade(TradeDto tradeDto);
	}
}

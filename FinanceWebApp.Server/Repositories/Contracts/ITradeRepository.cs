using FinanceWebApp.Api.Entities;
using FinanceWebApp.Dtos;

namespace FinanceWebApp.Api.Repositories.Contracts
{
	public interface ITradeRepository
	{
		Task<IEnumerable<Trade>> GetTrades();
		Task<IEnumerable<Trade>> GetTradesById(int id);
		Task AddTrade(TradeDto tradeDto);
	}
}

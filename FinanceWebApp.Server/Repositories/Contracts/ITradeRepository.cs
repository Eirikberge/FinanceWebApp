using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Dtos;

namespace FinanceWebApp.Server.Repositories.Contracts
{
	public interface ITradeRepository
	{
		Task<IEnumerable<Trade>> GetTrades();
		Task<IEnumerable<Trade>> GetTradesById(int id);
		Task AddTrade(TradeDto tradeDto);
	}
}

using FinanceWebApp.Server.Entities;

namespace FinanceWebApp.Server.Repositories.Contracts
{
	public interface IStockHoldingRepository
	{
		public Task<IEnumerable<StockHolding>> GetStockHoldingById(int id);
	}
}

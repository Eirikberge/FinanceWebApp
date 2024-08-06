using FinanceWebApp.Api.Entities;

namespace FinanceWebApp.Api.Repositories.Contracts
{
	public interface IStockHoldingRepository
	{
		public Task<IEnumerable<StockHolding>> GetStockHoldingById(int id);
	}
}

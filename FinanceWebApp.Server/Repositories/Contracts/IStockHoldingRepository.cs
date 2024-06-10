using FinanceApp.Api.Entities;

namespace FinanceApp.Api.Repositories.Contracts
{
	public interface IStockHoldingRepository
	{
		public Task<IEnumerable<StockHolding>> GetStockHoldingById(int id);
	}
}

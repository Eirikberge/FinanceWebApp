using FinanceWebApp.Api.Data;
using FinanceWebApp.Api.Entities;
using FinanceWebApp.Api.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;

namespace FinanceWebApp.Api.Repositories
{
    public class StockHoldingRepository : IStockHoldingRepository
    // Repositories tilhører databasen, mens service er til prosjektet.
    {
        private readonly FinanceAppContext _context;

        public StockHoldingRepository(FinanceAppContext context)
        {
	        _context = context;
        }

        public async Task<IEnumerable<StockHolding>> GetStockHoldingById(int id)
        {
	        return await _context.StockHoldings
		        .Where(sh => sh.UserId == id)
		        .ToListAsync();
        }
    }
}

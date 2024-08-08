using FinanceWebApp.Server.Data;
using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;

namespace FinanceWebApp.Server.Repositories
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

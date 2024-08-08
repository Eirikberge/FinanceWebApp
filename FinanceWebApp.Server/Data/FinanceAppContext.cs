using FinanceWebApp.Server.Entities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;

namespace FinanceWebApp.Server.Data
{
	public class FinanceAppContext : DbContext
	{
		public FinanceAppContext(DbContextOptions<FinanceAppContext> options) : base(options)
		{

		}

		public DbSet<User> Users { get; set; }
		public DbSet<Trade> Trades { get; set; }
		public DbSet<StockHolding> StockHoldings { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<User>()
				.HasKey(u => u.Id);

			modelBuilder.Entity<Trade>()
				.HasKey(t => t.Id);

			modelBuilder.Entity<Trade>()
				.HasOne(t => t.User)
				.WithMany(u => u.Trades)
				.HasForeignKey(t => t.UserId);

			modelBuilder.Entity<StockHolding>()
				.HasKey(sh => new { sh.StockSymbol, sh.UserId });

			modelBuilder.Entity<StockHolding>()
				.HasOne(sh => sh.User)
				.WithMany(u => u.StockHoldings)
				.HasForeignKey(sh => sh.UserId);
		}
		public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			var modifiedEntries = ChangeTracker.Entries<Trade>()
				.Where(e => e.State == EntityState.Added ||
				            e.State == EntityState.Modified ||
				            e.State == EntityState.Deleted);

			foreach (var entry in modifiedEntries)
			{
				var trade = entry.Entity;
				var userId = trade.UserId;
				var stockSymbol = trade.StockSymbol;
				var quantityChange = 0;
				var priceChange = 0f;

				switch (entry.State)
				{
					case EntityState.Added:
						quantityChange = trade.Quantity;
						priceChange = trade.Price;
						break;
					case EntityState.Modified:
						var originalQuantity = entry.OriginalValues.GetValue<int>("Quantity");
						var originalPrice = entry.OriginalValues.GetValue<float>("Price");
						quantityChange = trade.Quantity - originalQuantity;
						priceChange = originalPrice;
						break;
					case EntityState.Deleted:
						var originalQuantityDeleted = entry.OriginalValues.GetValue<int>("Quantity");
						quantityChange = -originalQuantityDeleted;
						priceChange = 0;
						break;
				}

				UpdateUserStockHoldings(userId, stockSymbol, quantityChange, priceChange);
			}

			return await base.SaveChangesAsync(cancellationToken);
		}
		private void UpdateUserStockHoldings(int userId, string stockSymbol, int quantityChange, float priceChange)
		{
			var user = Users.Include(u => u.StockHoldings)
							.Single(u => u.Id == userId);

			var stockHolding = user.StockHoldings.FirstOrDefault(sh => sh.StockSymbol == stockSymbol);

			if (stockHolding != null)
			{
				stockHolding.Quantity += quantityChange;
				if (quantityChange <= 0)
				{
					stockHolding.Price = stockHolding.Price;
				}
				else
				{
					stockHolding.Price = (quantityChange * priceChange + stockHolding.Quantity * stockHolding.Price) / (quantityChange + stockHolding.Quantity);
				}

				if (stockHolding.Quantity <= 0)
				{
					user.StockHoldings.Remove(stockHolding);
				}
			}
			else
			{
				if (quantityChange > 0)
				{
					user.StockHoldings.Add(new StockHolding { StockSymbol = stockSymbol, Quantity = quantityChange , Price = priceChange});
				}
			}
		}
	}
}
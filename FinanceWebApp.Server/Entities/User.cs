using FinanceApp.Models.Dtos;

namespace FinanceApp.Api.Entities
{
	public class User
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Password { get; set; }
		public float Capital { get; set; }
		public ICollection<Trade> Trades { get; set; }
		public ICollection<StockHolding> StockHoldings { get; set; }


		public User()
		{
			Capital = 0;
			Trades = new List<Trade>();
			StockHoldings = new List<StockHolding>();
		}
	}
}

using System.Text.Json.Serialization;

namespace FinanceWebApp.Server.Entities
{
	public class Trade
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		[JsonIgnore]
		public User User { get; set; } 

		public string StockSymbol { get; set; }

		public float Price { get; set; }
		public int Quantity { get; set; }
		public DateTime TimeStamp { get; set; }
	}
}

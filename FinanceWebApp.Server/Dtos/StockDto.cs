namespace FinanceWebApp.Dtos
{
	public class StockDto
	{
		public string Name { get; set; }
		public string Symbol { get; set; }
		public float BuyingPrice { get; set; }
		public float CurrentPrice { get; set; }
		public int Quantity { get; set; }
		public float Beta { get; set; }
		public float DividendPSAnnual { get; set; }
	}
}
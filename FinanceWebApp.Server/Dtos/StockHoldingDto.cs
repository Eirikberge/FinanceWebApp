namespace FinanceWebApp.Dtos
{
	public class StockHoldingDto
	{
		public string StockSymbol { get; set; }
		public int Quantity { get; set; }
		public int UserID { get; set; }
		public float Price { get; set; }
	}
}

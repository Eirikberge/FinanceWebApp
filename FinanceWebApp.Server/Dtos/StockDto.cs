using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceApp.Models.Dtos
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
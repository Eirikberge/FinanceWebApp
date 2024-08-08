using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;


namespace FinanceWebApp.Server.Dtos
{
	public class TradeDto
	{
		public int UserId { get; set; }
		public string StockSymbol { get; set; }
		public float Price { get; set; }
		public int Quantity { get; set; }
		public DateTime TimeStamp { get; set; }
	}

}

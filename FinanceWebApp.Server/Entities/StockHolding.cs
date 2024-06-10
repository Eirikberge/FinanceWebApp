﻿using System.Text.Json.Serialization;

namespace FinanceApp.Api.Entities
{
	public class StockHolding
	{
		[JsonIgnore]
		public User User { get; set; }
		public int UserId { get; set; }
		public string StockSymbol { get; set; }
		public int Quantity { get; set; }
		public float Price { get; set; }
	}
}

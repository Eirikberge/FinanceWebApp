using System.Text.Json.Serialization;

namespace FinanceApp.Models.Dtos
{
	public class EarningsCalendarDto
	{
		[JsonPropertyName("date")]
		public string? Date { get; set; }

		[JsonPropertyName("epsActual")]
		public double? EpsActual { get; set; }

		[JsonPropertyName("epsEstimate")]
		public double? EpsEstimate { get; set; }

		[JsonPropertyName("hour")]
		public string? Hour { get; set; }

		[JsonPropertyName("quarter")]
		public int? Quarter { get; set; }

		[JsonPropertyName("revenueActual")]
		public long? RevenueActual { get; set; }

		[JsonPropertyName("revenueEstimate")]
		public long? RevenueEstimate { get; set; }

		[JsonPropertyName("symbol")]
		public string? Symbol { get; set; }

		[JsonPropertyName("year")]
		public int? Year { get; set; }
	}
}
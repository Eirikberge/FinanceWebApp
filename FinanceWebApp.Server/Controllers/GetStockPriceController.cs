using System.Text.Json;
using System.Text.Json.Serialization;
using FinanceWebApp.Server.Entities;
using FinanceWebApp.Server.Dtos;
using Microsoft.AspNetCore.Mvc;
using FinanceWebApp.Server.Services;


namespace FinanceApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GetStockPriceController : Controller
	{
		private readonly HttpClient _httpClient;
		private static OutgoingRateLimiter _limiter = new OutgoingRateLimiter();

		public GetStockPriceController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpGet("api/getstockprice/{symbol}")]
		public ActionResult<StockPriceCandleDto> GetStockPrice(string symbol)
		{
			var request = new HttpRequestMessage(HttpMethod.Get, $"https://finnhub.io/api/v1/quote?symbol={symbol}");
			request.Headers.Add("X-Finnhub-Token", "co5tdu1r01qv77g7q8bgco5tdu1r01qv77g7q8c0");

			try
			{
				_limiter.WaitForFinnhubLimiter();

				var response = _httpClient.Send(request);

				if (!response.IsSuccessStatusCode)
				{
					var errorMessage = $"Error fetching stock price. Status code: {response.StatusCode}";
					return StatusCode((int)response.StatusCode, new { message = errorMessage });
				}

				var deserialized = JsonSerializer.Deserialize<QuoteResponse>(response.Content.ReadAsStream());

				if (deserialized == null)
				{
					return NoContent();
				}

				var stockPrice = new StockPriceCandleDto
				{
					Symbol = symbol,
					Current = deserialized.Current,
					High = deserialized.High,
					Low = deserialized.Low,
					Previous = deserialized.Previous,
					PercentChange = deserialized.PercentChange,
					Change = deserialized.Change,
					Open = deserialized.Open
				};

				return Ok(stockPrice);
			}
			catch (Exception ex)
			{
				var errorMessage = $"An error occurred: {ex.Message}";
				return StatusCode(500, new { message = errorMessage });
			}
		}
	}

	public class QuoteResponse
	{
		[JsonPropertyName("c")]
		public float Current { get; set; }

		[JsonPropertyName("h")]
		public float High { get; set; }

		[JsonPropertyName("o")]
		public float Open { get; set; }

		[JsonPropertyName("pc")]
		public float Previous { get; set; }

		[JsonPropertyName("dp")]
		public float PercentChange { get; set; }

		[JsonPropertyName("l")]
		public float Low { get; set; }

		[JsonPropertyName("d")]
		public float Change { get; set; }
	}
}
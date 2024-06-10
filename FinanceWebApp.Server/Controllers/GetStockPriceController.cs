using System.Text.Json;
using System.Text.Json.Serialization;
using FinanceApp.Api.Entities;
using FinanceApp.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GetStockPriceController : Controller
	{
		private readonly HttpClient _httpClient;

		public GetStockPriceController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpGet("api/getstockprice/{symbol}")]

		public ActionResult<StockPriceCandleDto> GetStockPrice(string symbol)
		{
			var request = new HttpRequestMessage(HttpMethod.Get, $"https://finnhub.io/api/v1/quote?symbol={symbol}");
			request.Headers.Add("X-Finnhub-Token", "co5tdu1r01qv77g7q8bgco5tdu1r01qv77g7q8c0");
			var response = _httpClient.Send(request);
			if (!response.IsSuccessStatusCode)
			{
				return StatusCode((int)response.StatusCode);
			}

			var deserialized = JsonSerializer.Deserialize<QuoteResponse>(response.Content.ReadAsStream());
			if (deserialized == null)
			{
				return NoContent();
			}

			var stockPrice = new StockPriceCandleDto();
			stockPrice.Symbol = symbol;
			stockPrice.Current = deserialized.Current;
			stockPrice.High = deserialized.High;
			stockPrice.Low = deserialized.Low;
			stockPrice.Previous = deserialized.Previous;
			stockPrice.PercentChange = deserialized.PercentChange;
			stockPrice.Change = deserialized.Change;
			stockPrice.Open = deserialized.Open;

			return stockPrice;
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
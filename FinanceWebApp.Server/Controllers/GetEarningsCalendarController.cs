using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using FinanceApp.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApp.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GetEarningsCalendarController : ControllerBase
	{
		private readonly HttpClient _httpClient;

		public GetEarningsCalendarController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpGet("api/earningscalendar")]
		public async Task<ActionResult<IEnumerable<EarningsCalendarDto>>> GetEarningsCalendar([FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] string? symbol)
		{
			string apiUrl = $"https://finnhub.io/api/v1/calendar/earnings?from={from:yyyy-MM-dd}&to={to:yyyy-MM-dd}";

			if (!string.IsNullOrEmpty(symbol))
			{
				apiUrl += $"&symbol={symbol}";
			}

			var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
			request.Headers.Add("X-Finnhub-Token", "co5tdu1r01qv77g7q8bgco5tdu1r01qv77g7q8c0");

			var response = await _httpClient.SendAsync(request);

			if (!response.IsSuccessStatusCode)
			{
				return StatusCode((int)response.StatusCode);
			}

			var contentStream = await response.Content.ReadAsStreamAsync();
			var responseData = await JsonSerializer.DeserializeAsync<EarningsCalendarResponse>(contentStream);

			if (responseData == null || responseData.EarningsCalendar == null)
			{
				return NoContent();
			}

			return Ok(responseData.EarningsCalendar);
		}
	}

	public class EarningsCalendarResponse
	{
		[JsonPropertyName("earningsCalendar")]
		public IEnumerable<EarningsCalendarDto>? EarningsCalendar { get; set; }
	}
}
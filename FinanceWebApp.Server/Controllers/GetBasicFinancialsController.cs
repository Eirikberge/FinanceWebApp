using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using FinanceApp.Models.Dtos;

namespace FinanceApp.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GetBasicFinancialsController : Controller
	{
		private readonly HttpClient _httpClient;

		public GetBasicFinancialsController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}
		[HttpGet("api/basicfinancials")]
		public async Task<ActionResult<BasicFinancialsDto>> GetAsync(string symbol)
		{
			var request = new HttpRequestMessage(HttpMethod.Get, $"https://finnhub.io/api/v1/stock/metric?symbol={symbol}&metric=all");
			request.Headers.Add("X-Finnhub-Token", "co5tdu1r01qv77g7q8bgco5tdu1r01qv77g7q8c0");

			var response = await _httpClient.SendAsync(request);

			if (!response.IsSuccessStatusCode)
			{
				return StatusCode((int)response.StatusCode);
			}

			var contentStream = await response.Content.ReadAsStreamAsync();
			var responseData = await JsonSerializer.DeserializeAsync<MetricResponse>(contentStream);

			if (responseData == null || responseData.Metric == null)
			{
				return NoContent();
			}

			return Ok(responseData.Metric);
		}
	}
	public class MetricResponse
	{
		[JsonPropertyName("metric")]
		public BasicFinancialsDto Metric { get; set; }
	}
}

using FinanceWebApp.Server.Repositories;
using FinanceWebApp.Server.Repositories.Contracts;
using FinanceWebApp.Server.Services;
using FinanceWebApp.Server.Data;

using Microsoft.EntityFrameworkCore;

namespace FinanceWebApp.Server
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.

			builder.Services.AddControllers();
			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			builder.Services.AddDbContext<FinanceAppContext>(options =>
				options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

			builder.Services.AddScoped<ITradeRepository, TradeRepository>();
			builder.Services.AddScoped<IStockHoldingRepository, StockHoldingRepository>();

			builder.Services.AddHttpClient();

			builder.Services.AddSingleton<OutgoingRateLimiter>();

			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowSpecificOrigin", builder =>
				{
					builder.WithOrigins("https://localhost:5175")
						.AllowAnyMethod()
						.AllowAnyHeader();
				});
			});

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseAuthorization();

			app.UseCors("AllowSpecificOrigin");

			app.MapControllers();

			app.Run();
		}
	}
}
namespace FinanceWebApp.Server.Dtos;

public class StockPriceCandleDto
{
    public float Current { get; set; }
    public float Open { get; set; }
    public float Previous { get; set; }
    public float High { get; set; }
    public float PercentChange { get; set; }
    public float Change { get; set; }
    public float Low { get; set; }
    public string Symbol { get; set; } = null!;
}
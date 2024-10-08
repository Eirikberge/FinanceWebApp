﻿namespace FinanceWebApp.Server.Services
{
	public class OutgoingRateLimiter
	{
		private static OutgoingRateLimiter? _instance;
		public static OutgoingRateLimiter Instance => _instance ??= new OutgoingRateLimiter();
		private int _finnhubRequests;
		private int _secRequests;
		private Task _limiterTask;

		public OutgoingRateLimiter()
		{
			_finnhubRequests = 0;
			_limiterTask = ResetLimiter();
		}

		private async Task ResetLimiter()
		{
			while (true)
			{
				_finnhubRequests = 0;
				await Task.Delay(1000);
			}
		}

		public void WaitForFinnhubLimiter()
		{
			while (_finnhubRequests >= 60)
			{
				Thread.Sleep(300);
			}

			_finnhubRequests++;
			return;
		}
	}
}
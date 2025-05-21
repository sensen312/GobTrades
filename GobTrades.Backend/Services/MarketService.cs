// NEW FILE: Implementation for MarketService for Phase 1.

using GobTrades.Backend.Dtos;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace GobTrades.Backend.Services
{
    public class MarketService : IMarketService
    {
        private readonly ILogger<MarketService> _logger;

        // Market hours (local server time)
        private readonly TimeSpan _marketOpenTime = new TimeSpan(12, 0, 0); // 12:00 PM
        private readonly TimeSpan _marketCloseTime = new TimeSpan(19, 0, 0); // 7:00 PM (19:00)

        public MarketService(ILogger<MarketService> logger)
        {
            _logger = logger;
        }

        public Task<MarketStatusResponseDto> GetMarketStatusAsync()
        {
            var now = DateTime.Now; // Server's local time
            var today = now.Date;

            var marketOpenDateTime = today + _marketOpenTime;
            var marketCloseDateTime = today + _marketCloseTime;

            bool isMarketOpen = now >= marketOpenDateTime && now < marketCloseDateTime;
            string? endTimeIso = isMarketOpen || now < marketOpenDateTime ? marketCloseDateTime.ToString("o") : null; // "o" for ISO 8601

            if (now >= marketCloseDateTime) // If market already closed for the day
            {
                isMarketOpen = false;
                endTimeIso = null;
            }
            
            _logger.LogInformation("Market Status Check: IsOpen={IsOpen}, EndTime={EndTimeISO}", isMarketOpen, endTimeIso);

            return Task.FromResult(new MarketStatusResponseDto
            {
                IsMarketOpen = isMarketOpen,
                EndTime = endTimeIso
            });
        }
    }
}

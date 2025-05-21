// NEW FILE: DTOs for market status.

using System;

namespace GobTrades.Backend.Dtos
{
    public class MarketStatusResponseDto
    {
        public bool IsMarketOpen { get; set; }
        public string? EndTime { get; set; } // ISO 8601 string or null
    }
}

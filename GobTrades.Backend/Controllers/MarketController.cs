// NEW FILE: Controller for market status.

using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace GobTrades.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarketController : ControllerBase
    {
        private readonly ILogger<MarketController> _logger;
        private readonly IMarketService _marketService;

        public MarketController(ILogger<MarketController> logger, IMarketService marketService)
        {
            _logger = logger;
            _marketService = marketService;
        }

        [HttpGet("status")]
        [ProducesResponseType(typeof(MarketStatusResponseDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMarketStatus()
        {
            _logger.LogInformation("GET /api/market/status called");
            var status = await _marketService.GetMarketStatusAsync();
            return Ok(status);
        }
    }
}

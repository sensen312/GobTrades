using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Http; // Required for StatusCodes, HttpContext
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq; // Required for FirstOrDefault
using System.Threading.Tasks; // Required for Task
using System.Collections.Generic; // Required for List

namespace GobTrades.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TradesController : ControllerBase
    {
        private readonly ILogger<TradesController> _logger;
        private readonly ITradeService _tradeService;

        public TradesController(ILogger<TradesController> logger, ITradeService tradeService)
        {
            _logger = logger;
            _tradeService = tradeService;
        }

        [HttpPost("request")]
        [ProducesResponseType(typeof(RequestTradeResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RequestTrade([FromBody] RequestTradePayloadDto payload)
        {
            string? senderUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(senderUuid)) return Unauthorized("User UUID header is required.");
            if (senderUuid == payload.TargetUserUuid) return BadRequest("Users cannot send trade requests to themselves.");

            _logger.LogInformation("POST /request called by {SenderUuid} for {TargetUserUuid}", senderUuid, payload.TargetUserUuid);
            var (response, errorMessage) = await _tradeService.CreateTradeRequestAsync(senderUuid, payload);
             if (response == null) return BadRequest(errorMessage ?? "Failed to create trade request.");
            return Ok(response);
        }

        [HttpGet("requests")]
        [ProducesResponseType(typeof(List<TradeRequestDto>), StatusCodes.Status200OK)] // Corrected type
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetPendingRequests()
        {
            string? recipientUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(recipientUuid)) return Unauthorized("User UUID header is required.");

            _logger.LogInformation("GET /requests called for user {RecipientUuid}", recipientUuid);
            var requests = await _tradeService.GetPendingRequestsAsync(recipientUuid);
            return Ok(requests); // Return the list directly
        }

        [HttpPost("respond")]
        [ProducesResponseType(typeof(RespondToTradeResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RespondToTrade([FromBody] RespondToTradeRequestPayloadDto payload)
        {
            string? recipientUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(recipientUuid)) return Unauthorized("User UUID header is required.");

            _logger.LogInformation("POST /respond called by {RecipientUuid} for RequestId {TradeRequestId}", recipientUuid, payload.TradeRequestId);
             var (response, errorMessage) = await _tradeService.RespondToTradeRequestAsync(recipientUuid, payload);
             if (response == null) return BadRequest(errorMessage ?? "Failed to respond to trade request.");
            return Ok(response);
        }
    }
}
using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Http; // Required for StatusCodes, HttpContext, IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson; // Required for ObjectId
using System.Linq; // Required for FirstOrDefault
using System.Threading.Tasks; // Required for Task

namespace GobTrades.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ILogger<MessagesController> _logger;
        private readonly IMessageService _messageService;

        public MessagesController(ILogger<MessagesController> logger, IMessageService messageService)
        {
            _logger = logger;
            _messageService = messageService;
        }

        [HttpGet("chats-and-requests")]
        [ProducesResponseType(typeof(FetchChatsAndRequestsResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetChatsAndRequests()
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid)) return Unauthorized("User UUID header is required.");

            _logger.LogInformation("GET /chats-and-requests called for user {UserUuid}", userUuid);
            var response = await _messageService.GetChatsAndRequestsAsync(userUuid);
            return Ok(response);
        }

        [HttpGet("chats/{chatId}/messages")]
        [ProducesResponseType(typeof(FetchMessagesResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMessages(string chatId, [FromQuery] FetchMessagesParamsDto queryParams)
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid)) return Unauthorized("User UUID header is required.");
            if (!ObjectId.TryParse(chatId, out _)) return BadRequest("Invalid chat ID format.");

            _logger.LogInformation("GET /chats/{ChatId}/messages called by user {UserUuid}", chatId, userUuid);
            var response = await _messageService.GetMessagesForChatAsync(userUuid, chatId, queryParams);
            // TODO: Service should return info to differentiate 403/404
            return Ok(response);
        }

        [HttpPost("images")]
        [ProducesResponseType(typeof(UploadChatImageResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UploadImage(IFormFile imageFile)
        {
             string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid)) return Unauthorized("User UUID header is required.");
             if (imageFile == null || imageFile.Length == 0) return BadRequest("No image file provided or file is empty.");

             _logger.LogInformation("POST /images called by user {UserUuid}", userUuid);
             var (response, errorMessage) = await _messageService.SaveChatImageAsync(userUuid, imageFile);
             if (response == null) return BadRequest(errorMessage ?? "Failed to save image.");
             return Ok(response);
        }


        [HttpPost("chats/{chatId}/read")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> MarkChatAsRead(string chatId)
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid)) return Unauthorized("User UUID header is required.");
            if (!ObjectId.TryParse(chatId, out _)) return BadRequest("Invalid chat ID format.");

            _logger.LogInformation("POST /chats/{ChatId}/read called by user {UserUuid}", chatId, userUuid);
            var (success, errorMessage) = await _messageService.MarkChatAsReadAsync(userUuid, chatId);
            if (!success) return BadRequest(errorMessage ?? "Failed to mark chat as read."); // TODO: Differentiate 403/404
            return NoContent();
        }
    }
}
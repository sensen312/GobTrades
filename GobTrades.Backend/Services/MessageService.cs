using GobTrades.Backend.Data;
using GobTrades.Backend.Dtos;
using GobTrades.Backend.Models;
using Microsoft.AspNetCore.Http; // Required for IFormFile
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System; // Required for Guid, Path, Exception
using System.IO; // Required for Path
using System.Threading.Tasks; // Required for Task
using System.Collections.Generic; // Required for List

namespace GobTrades.Backend.Services
{
    public class MessageService : IMessageService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<MessageService> _logger;
        private readonly ITradeService _tradeService;

        public MessageService(MongoDbContext context, ILogger<MessageService> logger, ITradeService tradeService)
        {
            _context = context;
            _logger = logger;
            _tradeService = tradeService;
        }

        public async Task<FetchChatsAndRequestsResponseDto> GetChatsAndRequestsAsync(string userUuid)
        {
             _logger.LogInformation("GetChatsAndRequestsAsync called for {UserUuid}", userUuid);
             // TODO Phase 4/7: Fetch actual chats and map them
             var pendingRequests = await _tradeService.GetPendingRequestsAsync(userUuid);
             var response = new FetchChatsAndRequestsResponseDto
             {
                 Chats = new List<ChatPreviewDto>(), // Empty chat list for Phase 1
                 TradeRequests = pendingRequests ?? new List<TradeRequestDto>()
             };
             return response;
        }

        public Task<FetchMessagesResponseDto> GetMessagesForChatAsync(string userUuid, string chatId, FetchMessagesParamsDto queryParams)
        {
            _logger.LogInformation("GetMessagesForChatAsync called for Chat {ChatId} by {UserUuid} (Phase 1 Stub)", chatId, userUuid);
            // TODO Phase 4/7: Implement logic
            var dummyResponse = new FetchMessagesResponseDto
            {
                Items = new List<MessageDto>(),
                HasMore = false,
                CurrentPage = queryParams.Page
            };
            return Task.FromResult(dummyResponse);
        }

        public Task<(UploadChatImageResponseDto? Response, string? ErrorMessage)> SaveChatImageAsync(string userUuid, IFormFile imageFile)
        {
             _logger.LogInformation("SaveChatImageAsync called by {UserUuid} (Phase 1 Stub)", userUuid);
             // TODO Phase 4/7: Implement actual image saving to disk/blob storage
             if (imageFile == null || imageFile.Length == 0)
             {
                 return Task.FromResult<(UploadChatImageResponseDto?, string?)>((null, "No image file provided."));
             }
             string dummyFilename = $"chat_image_{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
             var dummyResponse = new UploadChatImageResponseDto { ImageFilename = dummyFilename };
             _logger.LogInformation("Generated dummy filename: {Filename}", dummyFilename);
             // In a real implementation, save the file here:
             // var filePath = Path.Combine("path/to/image/storage", dummyFilename);
             // using (var stream = File.Create(filePath)) { await imageFile.CopyToAsync(stream); }
             return Task.FromResult<(UploadChatImageResponseDto?, string?)>((dummyResponse, null));
        }

         public Task<(bool Success, string? ErrorMessage)> MarkChatAsReadAsync(string userUuid, string chatId)
         {
             _logger.LogInformation("MarkChatAsReadAsync called for Chat {ChatId} by {UserUuid} (Phase 1 Stub)", chatId, userUuid);
             // TODO Phase 4/7: Implement logic
             return Task.FromResult<(bool Success, string? ErrorMessage)>((true, null));
         }
    }
}
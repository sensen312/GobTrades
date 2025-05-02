using GobTrades.Backend.Data;
using GobTrades.Backend.Dtos;
using GobTrades.Backend.Models;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Bson; // Required for ObjectId
using System; // Required for Exception
using System.Linq; // Required for Select
using System.Threading.Tasks; // Required for Task
using System.Collections.Generic; // Required for List

namespace GobTrades.Backend.Services
{
    public class TradeService : ITradeService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<TradeService> _logger;

        public TradeService(MongoDbContext context, ILogger<TradeService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public Task<(RequestTradeResponseDto? Response, string? ErrorMessage)> CreateTradeRequestAsync(string senderUuid, RequestTradePayloadDto payload)
        {
            _logger.LogInformation("CreateTradeRequestAsync called by {SenderUuid} for {TargetUserUuid} (Phase 1 Stub)", senderUuid, payload.TargetUserUuid);
            // TODO Phase 4/7: Implement full logic
            var dummyResponse = new RequestTradeResponseDto
            {
                Status = "request_sent",
                Message = "Trade request sent successfully (Phase 1 Stub)."
            };
            return Task.FromResult<(RequestTradeResponseDto?, string?)>((dummyResponse, null));
        }

        public async Task<List<TradeRequestDto>> GetPendingRequestsAsync(string recipientUuid)
        {
            _logger.LogInformation("GetPendingRequestsAsync called for {RecipientUuid}", recipientUuid);
            var filter = Builders<TradeRequest>.Filter.And(
                Builders<TradeRequest>.Filter.Eq(r => r.RecipientUuid, recipientUuid),
                Builders<TradeRequest>.Filter.Eq(r => r.Status, TradeRequestStatus.Pending)
            );
            var requests = await _context.TradeRequests
                                        .Find(filter)
                                        .SortByDescending(r => r.CreatedAt)
                                        .ToListAsync();
            return requests.Select(MapToTradeRequestDto).ToList();
        }

        public Task<(RespondToTradeResponseDto? Response, string? ErrorMessage)> RespondToTradeRequestAsync(string recipientUuid, RespondToTradeRequestPayloadDto payload)
        {
            _logger.LogInformation("RespondToTradeRequestAsync called by {RecipientUuid} for RequestId {TradeRequestId}, Accept: {Accept} (Phase 1 Stub)", recipientUuid, payload.TradeRequestId, payload.Accept);
            // TODO Phase 4/7: Implement full logic
            string? chatId = payload.Accept ? ObjectId.GenerateNewId().ToString() : null;
            string message = payload.Accept ? "Trade accepted (Phase 1 Stub)." : "Trade declined (Phase 1 Stub).";
            var dummyResponse = new RespondToTradeResponseDto
            {
                Success = true,
                ChatId = chatId,
                Message = message
            };
            return Task.FromResult<(RespondToTradeResponseDto?, string?)>((dummyResponse, null));
        }

        private TradeRequestDto MapToTradeRequestDto(TradeRequest request)
        {
             if (request == null) return null!;
             return new TradeRequestDto
             {
                 Id = request.Id,
                 RecipientUuid = request.RecipientUuid,
                 Status = request.Status,
                 CreatedAt = request.CreatedAt,
                 SenderProfile = request.SenderProfile == null ? null! : new SenderProfileInfoDto
                 {
                      Id = request.SenderProfile.Id,
                      Uuid = request.SenderProfile.Uuid,
                      GoblinName = request.SenderProfile.GoblinName,
                      PfpIdentifier = request.SenderProfile.PfpIdentifier
                 }
             };
        }
    }
}
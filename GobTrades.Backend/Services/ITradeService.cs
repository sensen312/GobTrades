using GobTrades.Backend.Dtos;
using System.Collections.Generic; // Required for List
using System.Threading.Tasks; // Required for Task

namespace GobTrades.Backend.Services
{
    public interface ITradeService
    {
        Task<(RequestTradeResponseDto? Response, string? ErrorMessage)> CreateTradeRequestAsync(string senderUuid, RequestTradePayloadDto payload);
        Task<List<TradeRequestDto>> GetPendingRequestsAsync(string recipientUuid);
        Task<(RespondToTradeResponseDto? Response, string? ErrorMessage)> RespondToTradeRequestAsync(string recipientUuid, RespondToTradeRequestPayloadDto payload);
    }
}
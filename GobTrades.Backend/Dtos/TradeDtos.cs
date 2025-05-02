using System; // Required for DateTime
using System.Collections.Generic; // Required for List
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace GobTrades.Backend.Dtos
{
    public class TradeRequestDto
    {
        public string Id { get; set; } = null!;
        public SenderProfileInfoDto SenderProfile { get; set; } = null!;
        public string RecipientUuid { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class SenderProfileInfoDto
    {
        public string Id { get; set; } = null!;
        public string Uuid { get; set; } = null!;
        public string GoblinName { get; set; } = null!;
        public string PfpIdentifier { get; set; } = null!;
    }

    public class RequestTradePayloadDto
    {
        [Required]
        public string TargetUserUuid { get; set; } = null!;
    }

    public class RequestTradeResponseDto
    {
        [Required]
        public string Status { get; set; } = null!;
        public ChatPreviewDto? Chat { get; set; }
        public TradeRequestDto? TradeRequest { get; set; }
        public string? Message { get; set; }
    }

    public class FetchTradeRequestsResponseDto : List<TradeRequestDto> { }

    public class RespondToTradeRequestPayloadDto
    {
        [Required]
        [RegularExpression("^[a-f\\d]{24}$", ErrorMessage = "Invalid ObjectId format.")]
        public string TradeRequestId { get; set; } = null!;

        [Required]
        public bool Accept { get; set; }
    }

    public class RespondToTradeResponseDto
    {
        public bool Success { get; set; }
        [RegularExpression("^[a-f\\d]{24}$", ErrorMessage = "Invalid ObjectId format.")]
        public string? ChatId { get; set; }
        public string? Message { get; set; }
    }
}
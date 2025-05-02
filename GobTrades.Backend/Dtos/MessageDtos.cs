using System; // Required for DateTime
using System.Collections.Generic; // Required for List
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace GobTrades.Backend.Dtos
{
    public class ChatPreviewDto
    {
        public string Id { get; set; } = null!;
        public List<string> ParticipantUuids { get; set; } = new List<string>();
        public OtherParticipantDto OtherParticipant { get; set; } = null!;
        public string? LastMessagePreview { get; set; }
        public DateTime LastMessageAt { get; set; }
        public int UnreadCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class OtherParticipantDto
    {
        public string Id { get; set; } = null!;
        public string Uuid { get; set; } = null!;
        public string GoblinName { get; set; } = null!;
        public string PfpIdentifier { get; set; } = null!;
    }

    public class MessageDto
    {
        public string Id { get; set; } = null!;
        public string ChatId { get; set; } = null!;
        public string SenderUuid { get; set; } = null!;
        public string? Text { get; set; }
        public string? ImageFilename { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class FetchChatsAndRequestsResponseDto
    {
        public List<ChatPreviewDto> Chats { get; set; } = new List<ChatPreviewDto>();
        public List<TradeRequestDto> TradeRequests { get; set; } = new List<TradeRequestDto>();
    }

    public class FetchMessagesParamsDto
    {
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 30;
    }

    public class FetchMessagesResponseDto : PaginatedResponseDto<MessageDto> { }

    public class UploadChatImageResponseDto
    {
        [Required]
        public string ImageFilename { get; set; } = null!;
    }

    public class MarkChatAsReadRequestDto
    {
       // Currently empty based on frontend API call
    }
}
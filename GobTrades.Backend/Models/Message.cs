using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System; // Required for DateTime

namespace GobTrades.Backend.Models
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("chatId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ChatId { get; set; } = null!;

        [BsonElement("senderUuid")]
        public string SenderUuid { get; set; } = null!;

        [BsonElement("text")]
        [BsonIgnoreIfNull]
        public string? Text { get; set; }

        [BsonElement("imageFilename")]
        [BsonIgnoreIfNull]
        public string? ImageFilename { get; set; }

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
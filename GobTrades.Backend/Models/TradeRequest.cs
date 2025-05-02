using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System; // Required for DateTime

namespace GobTrades.Backend.Models
{
    public class TradeRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("senderUuid")]
        public string SenderUuid { get; set; } = null!;

        [BsonElement("recipientUuid")]
        public string RecipientUuid { get; set; } = null!;

        [BsonElement("status")]
        public string Status { get; set; } = TradeRequestStatus.Pending;

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("senderProfile")]
        [BsonIgnoreIfNull]
        public SenderProfileInfo? SenderProfile { get; set; }
    }

    public class SenderProfileInfo
    {
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; } = null!;

        [BsonElement("uuid")]
        public string Uuid { get; set; } = null!;

        [BsonElement("goblinName")]
        public string GoblinName { get; set; } = null!;

        [BsonElement("pfpIdentifier")]
        public string PfpIdentifier { get; set; } = null!;
    }

    public static class TradeRequestStatus
    {
        public const string Pending = "pending";
        public const string Accepted = "accepted";
        public const string Declined = "declined";
    }
}
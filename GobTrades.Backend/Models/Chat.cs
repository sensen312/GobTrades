using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic; // Required for List/Dictionary
using System; // Required for DateTime

namespace GobTrades.Backend.Models
{
    public class Chat
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("participantUuids")]
        public List<string> ParticipantUuids { get; set; } = new List<string>();

        [BsonElement("lastMessagePreview")]
        [BsonIgnoreIfNull]
        public string? LastMessagePreview { get; set; }

        [BsonElement("lastMessageAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;

        [BsonElement("participantInfo")]
        [BsonIgnoreIfNull]
        public List<ParticipantInfo>? ParticipantInfo { get; set; }

        [BsonElement("unreadCounts")]
        [BsonIgnoreIfNull]
        public Dictionary<string, int>? UnreadCounts { get; set; }

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ParticipantInfo
    {
        [BsonElement("uuid")]
        public string Uuid { get; set; } = null!;

        [BsonElement("goblinName")]
        public string GoblinName { get; set; } = null!;

        [BsonElement("pfpIdentifier")]
        public string PfpIdentifier { get; set; } = null!;
    }
}
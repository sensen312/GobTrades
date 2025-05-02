using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic; // Required for List

namespace GobTrades.Backend.Models
{
    public class UserProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("uuid")]
        public string Uuid { get; set; } = null!;

        [BsonElement("goblinName")]
        public string GoblinName { get; set; } = null!;

        [BsonElement("pfpIdentifier")]
        public string PfpIdentifier { get; set; } = null!;

        [BsonElement("items")]
        [BsonIgnoreIfNull]
        public List<Item> Items { get; set; } = new List<Item>();

        [BsonElement("offeredItemTags")]
        [BsonIgnoreIfNull]
        public List<string> OfferedItemTags { get; set; } = new List<string>();

        [BsonElement("wantsTags")]
        [BsonIgnoreIfNull]
        public List<string> WantsTags { get; set; } = new List<string>();

        [BsonElement("offeredItemsDescription")]
        public string OfferedItemsDescription { get; set; } = string.Empty;

        [BsonElement("wantedItemsDescription")]
        public string WantedItemsDescription { get; set; } = string.Empty;

        [BsonElement("likeCount")]
        public int LikeCount { get; set; } = 0;

        [BsonElement("lastActive")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime LastActive { get; set; } = DateTime.UtcNow;

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
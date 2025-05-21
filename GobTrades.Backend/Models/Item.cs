// MODIFIED: Ensured properties align with Phase 1 DTOs.
// Id is string because MongoDB driver handles ObjectId conversion.

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace GobTrades.Backend.Models
{
    public class Item
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // Auto-generate if new

        [BsonElement("itemName")]
        public string ItemName { get; set; } = null!;

        [BsonElement("imageFilename")]
        public string ImageFilename { get; set; } = null!; // For Phase 1, stores filename from client

        // Description per item might be a Phase 2+ feature.
        // For now, descriptions are stall-level.
        // [BsonElement("description")]
        // [BsonIgnoreIfNull]
        // public string? Description { get; set; }

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

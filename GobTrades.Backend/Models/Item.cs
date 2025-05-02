using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GobTrades.Backend.Models
{
    public class Item
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("imageFilename")]
        public string ImageFilename { get; set; } = null!;

        [BsonElement("itemName")]
        public string ItemName { get; set; } = null!;

        [BsonElement("description")]
        [BsonIgnoreIfNull]
        public string? Description { get; set; }

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
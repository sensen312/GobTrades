using GobTrades.Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic; // Required for List
using System.Threading.Tasks; // Required for Task
using System; // Required for GetAwaiter

namespace GobTrades.Backend.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            _settings = settings.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
             EnsureIndexesCreated();
        }

        public IMongoCollection<UserProfile> UserProfiles =>
            _database.GetCollection<UserProfile>(_settings.UserProfileCollectionName);

        public IMongoCollection<Chat> Chats =>
            _database.GetCollection<Chat>(_settings.ChatCollectionName);

        public IMongoCollection<Message> Messages =>
            _database.GetCollection<Message>(_settings.MessageCollectionName);

        public IMongoCollection<TradeRequest> TradeRequests =>
            _database.GetCollection<TradeRequest>(_settings.TradeRequestCollectionName);

        private void EnsureIndexesCreated()
        {
            try {
                var userProfileKeys = Builders<UserProfile>.IndexKeys;
                var uniqueIndexOptions = new CreateIndexOptions { Unique = true };
                var userProfileIndexes = new List<CreateIndexModel<UserProfile>>
                {
                    new CreateIndexModel<UserProfile>(userProfileKeys.Ascending(u => u.Uuid), uniqueIndexOptions),
                    new CreateIndexModel<UserProfile>(userProfileKeys.Ascending(u => u.LastActive)),
                    new CreateIndexModel<UserProfile>(userProfileKeys.Ascending(u => u.LikeCount)),
                    new CreateIndexModel<UserProfile>(userProfileKeys.Ascending(u => u.CreatedAt)),
                    new CreateIndexModel<UserProfile>(userProfileKeys.Ascending(u => u.OfferedItemTags)),
                    new CreateIndexModel<UserProfile>(userProfileKeys.Ascending(u => u.WantsTags)),
                };
                UserProfiles.Indexes.CreateManyAsync(userProfileIndexes).GetAwaiter().GetResult();

                var chatKeys = Builders<Chat>.IndexKeys;
                var chatIndexes = new List<CreateIndexModel<Chat>>
                {
                    new CreateIndexModel<Chat>(chatKeys.Ascending(c => c.ParticipantUuids)),
                    new CreateIndexModel<Chat>(chatKeys.Ascending(c => c.LastMessageAt))
                };
                Chats.Indexes.CreateManyAsync(chatIndexes).GetAwaiter().GetResult();

                var messageKeys = Builders<Message>.IndexKeys;
                var messageIndexes = new List<CreateIndexModel<Message>>
                {
                    new CreateIndexModel<Message>(messageKeys.Ascending(m => m.ChatId)),
                    new CreateIndexModel<Message>(messageKeys.Ascending(m => m.CreatedAt))
                };
                Messages.Indexes.CreateManyAsync(messageIndexes).GetAwaiter().GetResult();

                var tradeRequestKeys = Builders<TradeRequest>.IndexKeys;
                var tradeRequestIndexes = new List<CreateIndexModel<TradeRequest>>
                {
                    new CreateIndexModel<TradeRequest>(tradeRequestKeys.Ascending(t => t.RecipientUuid).Ascending(t => t.Status)),
                    new CreateIndexModel<TradeRequest>(tradeRequestKeys.Ascending(t => t.SenderUuid)),
                    new CreateIndexModel<TradeRequest>(tradeRequestKeys.Ascending(t => t.Status)),
                    new CreateIndexModel<TradeRequest>(tradeRequestKeys.Ascending(t => t.CreatedAt))
                };
                TradeRequests.Indexes.CreateManyAsync(tradeRequestIndexes).GetAwaiter().GetResult();
                 Console.WriteLine("MongoDB indexes checked/created.");
            } catch (Exception ex) {
                 Console.WriteLine($"Error creating MongoDB indexes: {ex.Message}");
                 // Log the full exception details in a real application
            }
        }
    }
}
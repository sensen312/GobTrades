namespace GobTrades.Backend.Models
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string UserProfileCollectionName { get; set; } = null!;
        public string ChatCollectionName { get; set; } = null!;
        public string MessageCollectionName { get; set; } = null!;
        public string TradeRequestCollectionName { get; set; } = null!;
    }
}
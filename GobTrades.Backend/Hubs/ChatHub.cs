using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System; // Required for Exception
using System.Threading.Tasks; // Required for Task

namespace GobTrades.Backend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public async Task SendMessage(string chatId, string messageText)
        {
             _logger.LogInformation("SendMessage called on Hub (Phase 1 Stub): ChatId={ChatId}, Message='{MessageText}'", chatId, messageText);
             // TODO Phase 4/7: Implement message saving and broadcasting
             await Task.CompletedTask;
        }

        public override async Task OnConnectedAsync()
        {
             var userUuid = Context.UserIdentifier;
             _logger.LogInformation("Client connected: {ConnectionId}, UserUUID: {UserUuid} (Phase 1 Stub - Auth needed)", Context.ConnectionId, userUuid ?? "N/A");
             // TODO Phase 4/7: Add connection to chat groups based on user's chats
             await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userUuid = Context.UserIdentifier;
            _logger.LogInformation("Client disconnected: {ConnectionId}, UserUUID: {UserUuid}, Error: {Error} (Phase 1 Stub)", Context.ConnectionId, userUuid ?? "N/A", exception?.Message);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
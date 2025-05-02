using GobTrades.Backend.Dtos;
using Microsoft.AspNetCore.Http; // Required for IFormFile
using System.Threading.Tasks; // Required for Task

namespace GobTrades.Backend.Services
{
    public interface IMessageService
    {
        Task<FetchChatsAndRequestsResponseDto> GetChatsAndRequestsAsync(string userUuid);
        Task<FetchMessagesResponseDto> GetMessagesForChatAsync(string userUuid, string chatId, FetchMessagesParamsDto queryParams);
        Task<(UploadChatImageResponseDto? Response, string? ErrorMessage)> SaveChatImageAsync(string userUuid, IFormFile imageFile);
        Task<(bool Success, string? ErrorMessage)> MarkChatAsReadAsync(string userUuid, string chatId);
    }
}
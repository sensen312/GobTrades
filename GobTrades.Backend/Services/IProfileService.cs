using GobTrades.Backend.Dtos;
using GobTrades.Backend.Models;
using System.Threading.Tasks; // Required for Task

namespace GobTrades.Backend.Services
{
    public interface IProfileService
    {
        Task<FetchProfilesResponseDto> GetFeedProfilesAsync(FetchProfilesParamsDto queryParams, string? currentUserUuid);
        Task<UserProfileDto?> GetMyProfileAsync(string userUuid);
        Task<UserProfileDto?> GetProfileByUuidAsync(string targetUuid, string? currentUserUuid);
        Task<(UserProfileDto? UpdatedProfile, string? ErrorMessage)> UpdateMyProfileAsync(string userUuid, UpdateProfileRequestDto profileData);
        Task<(bool Success, int? NewLikeCount, string? ErrorMessage)> LikeProfileAsync(string likerUuid, string targetUserUuid);
        Task<(CreateUserResponseDto? User, string? ErrorMessage)> CreateInitialUserAsync(CreateUserRequestDto userData);
    }
}
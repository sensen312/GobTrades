// MODIFIED: Interface for ProfileService for Phase 1.

using GobTrades.Backend.Dtos;
using System.Threading.Tasks;

namespace GobTrades.Backend.Services
{
    public interface IProfileService
    {
        Task<(CreateUserResponseDto? User, string? ErrorMessage)> CreateInitialUserAsync(CreateUserRequestDto userData);
        Task<UserProfileDto?> GetMyProfileAsync(string userUuid);
        Task<(UserProfileDto? UpdatedProfile, string? ErrorMessage)> UpdateMyProfileAsync(string userUuid, UpdateProfileRequestDto profileData);
        // GetFeedProfilesAsync, GetProfileByUuidAsync, LikeProfileAsync will be for Phase 2+
    }
}

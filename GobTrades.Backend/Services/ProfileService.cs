using GobTrades.Backend.Data;
using GobTrades.Backend.Dtos;
using GobTrades.Backend.Models;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Bson;
using System; // Required for DateTime, Exception
using System.Linq; // Required for Select
using System.Threading.Tasks; // Required for Task
using System.Collections.Generic; // Required for List

namespace GobTrades.Backend.Services
{
    public class ProfileService : IProfileService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<ProfileService> _logger;

        public ProfileService(MongoDbContext context, ILogger<ProfileService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public Task<FetchProfilesResponseDto> GetFeedProfilesAsync(FetchProfilesParamsDto queryParams, string? currentUserUuid)
        {
            _logger.LogInformation("GetFeedProfilesAsync called (Phase 1 Stub)");
            var dummyResponse = new FetchProfilesResponseDto
            {
                Items = new List<UserProfileDto>(),
                HasMore = false,
                CurrentPage = queryParams.Page,
            };
            return Task.FromResult(dummyResponse);
        }

        public async Task<UserProfileDto?> GetMyProfileAsync(string userUuid)
        {
            _logger.LogInformation("GetMyProfileAsync called for UUID: {UserUuid}", userUuid);
            var profile = await _context.UserProfiles
                                        .Find(p => p.Uuid == userUuid)
                                        .FirstOrDefaultAsync();
            return profile == null ? null : MapToUserProfileDto(profile);
        }

        public async Task<UserProfileDto?> GetProfileByUuidAsync(string targetUuid, string? currentUserUuid)
        {
             _logger.LogInformation("GetProfileByUuidAsync called for Target UUID: {TargetUuid}", targetUuid);
             var profile = await _context.UserProfiles
                                        .Find(p => p.Uuid == targetUuid)
                                        .FirstOrDefaultAsync();
             return profile == null ? null : MapToUserProfileDto(profile);
        }

        public async Task<(UserProfileDto? UpdatedProfile, string? ErrorMessage)> UpdateMyProfileAsync(string userUuid, UpdateProfileRequestDto profileData)
        {
            _logger.LogInformation("UpdateMyProfileAsync called for UUID: {UserUuid}", userUuid);
            var filter = Builders<UserProfile>.Filter.Eq(p => p.Uuid, userUuid);
            var existingProfile = await _context.UserProfiles.Find(filter).FirstOrDefaultAsync();
            DateTime now = DateTime.UtcNow;

            if (existingProfile == null)
            {
                 _logger.LogInformation("Profile not found for UUID {UserUuid}. Creating new profile.", userUuid);
                 // Fetch potential initial data if POST /users was used
                 var initialUserData = await _context.UserProfiles.Find(filter).FirstOrDefaultAsync();
                 if (initialUserData == null) {
                      return (null, "User profile base does not exist. Initial setup might be required via POST /api/users.");
                 }
                 existingProfile = initialUserData;
                 existingProfile.CreatedAt = now;
            }

            existingProfile.OfferedItemTags = profileData.OfferedItemTags;
            existingProfile.WantsTags = profileData.WantsTags;
            existingProfile.OfferedItemsDescription = profileData.OfferedItemsDescription;
            existingProfile.WantedItemsDescription = profileData.WantedItemsDescription;
            existingProfile.LastActive = now;
            existingProfile.UpdatedAt = now;

            // TODO Phase 2: Implement robust item mapping/diffing logic. This basic map is placeholder.
            existingProfile.Items = profileData.Items.Select(dto => new Item {
                Id = !string.IsNullOrEmpty(dto.Id) && ObjectId.TryParse(dto.Id, out _) ? dto.Id : ObjectId.GenerateNewId().ToString(),
                ItemName = dto.ItemName,
                Description = dto.Description,
                ImageFilename = dto.ImageFilename,
                CreatedAt = existingProfile.Items.FirstOrDefault(i => i.Id == dto.Id)?.CreatedAt ?? now, // Preserve original create date if possible
                UpdatedAt = now
            }).ToList();

             try
            {
                var replaceResult = await _context.UserProfiles.ReplaceOneAsync(filter, existingProfile, new ReplaceOptions { IsUpsert = true });

                // --- CORRECTED FAILURE CHECK ---
                bool wasSuccessful = replaceResult.IsAcknowledged &&
                                     (replaceResult.MatchedCount > 0 || replaceResult.ModifiedCount > 0 || (replaceResult.UpsertedId != null && !replaceResult.UpsertedId.IsBsonNull));

                if (!wasSuccessful)
                // --- END CORRECTION ---
                 {
                      _logger.LogWarning("UpdateMyProfileAsync failed to update/upsert profile for UUID: {UserUuid}. Matched:{Match}, Modified:{Mod}, UpsertedId:{UpId}",
                          userUuid, replaceResult.MatchedCount, replaceResult.ModifiedCount, replaceResult.UpsertedId);
                     return (null, "Failed to save stall data. The operation was not acknowledged or did not modify/insert any document.");
                 }

                 _logger.LogInformation("Profile updated/created successfully for UUID: {UserUuid}. Matched:{Match}, Modified:{Mod}, UpsertedId:{UpId}",
                    userUuid, replaceResult.MatchedCount, replaceResult.ModifiedCount, replaceResult.UpsertedId);

                 var updatedProfile = await _context.UserProfiles.Find(filter).FirstOrDefaultAsync(); // Re-fetch after update
                 return (updatedProfile != null ? MapToUserProfileDto(updatedProfile) : null, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile for UUID: {UserUuid}", userUuid);
                return (null, "An error occurred while saving stall data.");
            }
        }

        public Task<(bool Success, int? NewLikeCount, string? ErrorMessage)> LikeProfileAsync(string likerUuid, string targetUserUuid)
        {
            _logger.LogInformation("LikeProfileAsync called by {LikerUuid} for {TargetUserUuid} (Phase 1 Stub)", likerUuid, targetUserUuid);
            // TODO Phase 3: Implement logic
            return Task.FromResult<(bool Success, int? NewLikeCount, string? ErrorMessage)>((true, 1, null));
        }

        public async Task<(CreateUserResponseDto? User, string? ErrorMessage)> CreateInitialUserAsync(CreateUserRequestDto userData)
        {
             _logger.LogInformation("CreateInitialUserAsync called for UUID: {UserUuid}", userData.Uuid);
             var existing = await _context.UserProfiles.Find(u => u.Uuid == userData.Uuid).FirstOrDefaultAsync();
             if (existing != null)
             {
                 _logger.LogWarning("Attempted to create initial user, but UUID {UserUuid} already exists.", userData.Uuid);
                 return (null, "User already exists.");
             }

             var now = DateTime.UtcNow;
             var newUser = new UserProfile
             {
                 Id = ObjectId.GenerateNewId().ToString(),
                 Uuid = userData.Uuid,
                 GoblinName = userData.GoblinName,
                 PfpIdentifier = userData.PfpIdentifier,
                 Items = new List<Item>(),
                 OfferedItemTags = new List<string>(),
                 WantsTags = new List<string>(),
                 OfferedItemsDescription = string.Empty,
                 WantedItemsDescription = string.Empty,
                 LikeCount = 0,
                 LastActive = now,
                 CreatedAt = now,
                 UpdatedAt = now
             };

             try
             {
                 await _context.UserProfiles.InsertOneAsync(newUser);
                 _logger.LogInformation("Initial user created successfully for UUID: {UserUuid}", userData.Uuid);
                 var responseDto = new CreateUserResponseDto
                 {
                     Id = newUser.Id,
                     Uuid = newUser.Uuid,
                     GoblinName = newUser.GoblinName,
                     PfpIdentifier = newUser.PfpIdentifier,
                     CreatedAt = newUser.CreatedAt,
                     UpdatedAt = newUser.UpdatedAt
                 };
                 return (responseDto, null);
             }
             catch (Exception ex)
             {
                 _logger.LogError(ex, "Error creating initial user for UUID: {UserUuid}", userData.Uuid);
                 return (null, "An error occurred during initial user creation.");
             }
        }

        private UserProfileDto MapToUserProfileDto(UserProfile profile)
        {
            return new UserProfileDto
            {
                Id = profile.Id,
                Uuid = profile.Uuid,
                GoblinName = profile.GoblinName,
                PfpIdentifier = profile.PfpIdentifier,
                Items = profile.Items?.Select(item => new ItemDto {
                    Id = item.Id,
                    ItemName = item.ItemName,
                    Description = item.Description,
                    ImageFilename = item.ImageFilename,
                    CreatedAt = item.CreatedAt,
                    UpdatedAt = item.UpdatedAt
                }).ToList() ?? new List<ItemDto>(),
                OfferedItemTags = profile.OfferedItemTags ?? new List<string>(),
                WantsTags = profile.WantsTags ?? new List<string>(),
                OfferedItemsDescription = profile.OfferedItemsDescription,
                WantedItemsDescription = profile.WantedItemsDescription,
                LikeCount = profile.LikeCount,
                LastActive = profile.LastActive,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}
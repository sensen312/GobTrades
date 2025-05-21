// MODIFIED: Implementation for ProfileService for Phase 1.

using GobTrades.Backend.Data;
using GobTrades.Backend.Dtos;
using GobTrades.Backend.Models;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

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

        public async Task<(CreateUserResponseDto? User, string? ErrorMessage)> CreateInitialUserAsync(CreateUserRequestDto userData)
        {
            _logger.LogInformation("Attempting to create initial user for UUID: {UserUuid}", userData.Uuid);
            var existingProfile = await _context.UserProfiles.Find(p => p.Uuid == userData.Uuid).FirstOrDefaultAsync();
            if (existingProfile != null)
            {
                _logger.LogWarning("User with UUID {UserUuid} already exists.", userData.Uuid);
                return (null, "User already exists with this UUID.");
            }

            var now = DateTime.UtcNow;
            var newUserProfile = new UserProfile
            {
                Id = ObjectId.GenerateNewId().ToString(), // Server generates MongoDB ID
                Uuid = userData.Uuid,
                GoblinName = userData.GoblinName,
                PfpIdentifier = userData.PfpIdentifier,
                Items = new List<Item>(), // Initialize with empty stall
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
                await _context.UserProfiles.InsertOneAsync(newUserProfile);
                _logger.LogInformation("Successfully created initial user profile for UUID: {UserUuid}, DB ID: {DbId}", newUserProfile.Uuid, newUserProfile.Id);
                return (MapToCreateUserResponseDto(newUserProfile), null);
            }
            catch (MongoWriteException ex)
            {
                _logger.LogError(ex, "MongoDB write error creating initial user for UUID: {UserUuid}", userData.Uuid);
                if (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
                {
                    return (null, "User already exists (database constraint).");
                }
                return (null, "Database error during user creation.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Generic error creating initial user for UUID: {UserUuid}", userData.Uuid);
                return (null, "An unexpected error occurred during user creation.");
            }
        }

        public async Task<UserProfileDto?> GetMyProfileAsync(string userUuid)
        {
            _logger.LogInformation("Fetching profile/stall for user UUID: {UserUuid}", userUuid);
            var profile = await _context.UserProfiles.Find(p => p.Uuid == userUuid).FirstOrDefaultAsync();
            if (profile == null)
            {
                _logger.LogInformation("No profile found for user UUID: {UserUuid}", userUuid);
                return null;
            }
            return MapToUserProfileDto(profile);
        }

        public async Task<(UserProfileDto? UpdatedProfile, string? ErrorMessage)> UpdateMyProfileAsync(string userUuid, UpdateProfileRequestDto profileData)
        {
            _logger.LogInformation("Attempting to update/create stall for user UUID: {UserUuid}", userUuid);
            var filter = Builders<UserProfile>.Filter.Eq(p => p.Uuid, userUuid);
            var existingProfile = await _context.UserProfiles.Find(filter).FirstOrDefaultAsync();
            var now = DateTime.UtcNow;

            UserProfile profileToSave;

            if (existingProfile == null)
            {
                _logger.LogWarning("Profile not found for UUID {UserUuid} during UpdateMyProfileAsync. This implies initial user creation might have been skipped or failed.", userUuid);
                return (null, "User profile base does not exist. Please ensure initial setup (POST /api/users) was completed.");
            }
            profileToSave = existingProfile;

            profileToSave.OfferedItemsDescription = profileData.OfferedItemsDescription;
            profileToSave.WantedItemsDescription = profileData.WantedItemsDescription;
            profileToSave.OfferedItemTags = profileData.OfferedItemTags ?? new List<string>();
            profileToSave.WantsTags = profileData.WantsTags ?? new List<string>();
            profileToSave.LastActive = now;
            profileToSave.UpdatedAt = now;

            profileToSave.Items = profileData.Items.Select(itemDto => new Item
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ItemName = itemDto.ItemName,
                ImageFilename = itemDto.ImageFilename,
                CreatedAt = now,
                UpdatedAt = now
            }).ToList();

            try
            {
                var result = await _context.UserProfiles.ReplaceOneAsync(filter, profileToSave, new ReplaceOptions { IsUpsert = true });
                if (result.IsAcknowledged && (result.MatchedCount > 0 || result.ModifiedCount > 0 || result.UpsertedId != null))
                {
                    _logger.LogInformation("Successfully updated/upserted profile for UUID: {UserUuid}. Matched: {Matched}, Modified: {Modified}, UpsertedId: {UpsertedId}",
                        userUuid, result.MatchedCount, result.ModifiedCount, result.UpsertedId?.ToString());
                    var updatedProfileFromDb = await _context.UserProfiles.Find(filter).FirstOrDefaultAsync();
                    return (updatedProfileFromDb != null ? MapToUserProfileDto(updatedProfileFromDb) : null, null);
                }
                else
                {
                    _logger.LogWarning("Profile update for UUID {UserUuid} was not acknowledged or did not modify/upsert any document.", userUuid);
                    return (null, "Failed to save stall data to the database.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile for UUID: {UserUuid}", userUuid);
                return (null, "An unexpected error occurred while saving stall data.");
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
                Items = profile.Items?.Select(item => new ItemDto
                {
                    Id = item.Id,
                    ItemName = item.ItemName,
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

        private CreateUserResponseDto MapToCreateUserResponseDto(UserProfile profile)
        {
            return new CreateUserResponseDto
            {
                Id = profile.Id,
                Uuid = profile.Uuid,
                GoblinName = profile.GoblinName,
                PfpIdentifier = profile.PfpIdentifier,
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}

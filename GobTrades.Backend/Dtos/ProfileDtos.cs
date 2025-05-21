// MODIFIED: DTOs for profile/stall management for Phase 1.

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GobTrades.Backend.Dtos
{
    // DTO for individual items when updating/creating a stall
    public class UpdateItemDto
    {
        // Id is optional: present if updating an existing item, null/absent for a new item.
        // Backend will use this to diff. For Phase 1, client might not send this if all items are treated as new on each save.
        // However, for future item editing, it's good to have.
        public string? Id { get; set; } // Existing MongoDB ObjectId of the item if updating

        // public string? LocalId { get; set; } // Client-side temporary ID, useful if backend needs to map responses to specific new items. Not strictly needed for Phase 1 if backend returns the whole updated stall.

        [Required]
        public string ItemName { get; set; } = null!;

        [Required]
        public string ImageFilename { get; set; } = null!; // Filename derived by client for Phase 1
    }

    // DTO for creating/updating the user's stall
    public class UpdateProfileRequestDto
    {
        // GoblinName & PfpIdentifier could be here if they are updatable via this endpoint.
        // For Phase 1, assuming they are set during initial POST /users and not changed here.

        [Required]
        [MaxLength(10, ErrorMessage = "Cannot have more than 10 items.")]
        public List<UpdateItemDto> Items { get; set; } = new List<UpdateItemDto>();

        [Required(ErrorMessage = "Offered items description is required.")]
        public string OfferedItemsDescription { get; set; } = string.Empty;

        [Required(ErrorMessage = "Wanted items description is required.")]
        public string WantedItemsDescription { get; set; } = string.Empty;

        [MaxLength(4, ErrorMessage = "Maximum of 4 offered item tags.")]
        public List<string> OfferedItemTags { get; set; } = new List<string>();

        [MaxLength(4, ErrorMessage = "Maximum of 4 wanted tags.")]
        public List<string> WantsTags { get; set; } = new List<string>();

        // public List<string>? RemovedItemIds { get; set; } // For Phase 2+ to explicitly signal item deletions
    }

    // DTO for representing an item in responses
    public class ItemDto
    {
        public string Id { get; set; } = null!;
        public string ItemName { get; set; } = null!;
        public string ImageFilename { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // DTO for representing a user's profile/stall in responses
    public class UserProfileDto
    {
        public string Id { get; set; } = null!; // MongoDB ObjectId
        public string Uuid { get; set; } = null!;
        public string GoblinName { get; set; } = null!;
        public string PfpIdentifier { get; set; } = null!;
        public List<ItemDto> Items { get; set; } = new List<ItemDto>();
        public List<string> OfferedItemTags { get; set; } = new List<string>();
        public List<string> WantsTags { get; set; } = new List<string>();
        public string OfferedItemsDescription { get; set; } = string.Empty;
        public string WantedItemsDescription { get; set; } = string.Empty;
        public int LikeCount { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public record UpdateProfileResponseDto(
        string Id,
        string Uuid,
        string GoblinName,
        string PfpIdentifier,
        List<ItemDto> Items,
        List<string> OfferedItemTags,
        List<string> WantsTags,
        string OfferedItemsDescription,
        string WantedItemsDescription,
        int LikeCount,
        DateTime LastActive,
        DateTime CreatedAt,
        DateTime UpdatedAt
    ); // Using record for concise DTO, can also be class like UserProfileDto
}

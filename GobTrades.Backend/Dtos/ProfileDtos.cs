using System; // Required for DateTime
using System.Collections.Generic; // Required for List
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace GobTrades.Backend.Dtos
{
    public class UserProfileDto
    {
        public string Id { get; set; } = null!;
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

    public class ItemDto
    {
        public string Id { get; set; } = null!;
        public string ImageFilename { get; set; } = null!;
        public string ItemName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class FetchProfilesParamsDto
    {
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string? OfferedItemTags { get; set; }
        public string? WantsTags { get; set; }
        public string? SortBy { get; set; } = "lastActive";
        public string? SearchTerm { get; set; }
    }

    public class FetchProfilesResponseDto : PaginatedResponseDto<UserProfileDto> { }

    public class FetchProfileResponseDto : UserProfileDto { }

    public class UpdateProfileRequestDto
    {
        [Required]
        [MaxLength(10)]
        public List<UpdateItemDto> Items { get; set; } = new List<UpdateItemDto>();

        [Required]
        [MaxLength(4)]
        public List<string> OfferedItemTags { get; set; } = new List<string>();

        [Required]
        [MaxLength(4)]
        public List<string> WantsTags { get; set; } = new List<string>();

        [Required]
        public string OfferedItemsDescription { get; set; } = string.Empty;

        [Required]
        public string WantedItemsDescription { get; set; } = string.Empty;
    }

    public class UpdateItemDto
    {
        [RegularExpression("^[a-f\\d]{24}$", ErrorMessage = "Invalid ObjectId format.")]
        public string? Id { get; set; }

        public string? LocalId { get; set; }

        [Required]
        public string ItemName { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        public string ImageFilename { get; set; } = null!;
    }

    public class UpdateProfileResponseDto : UserProfileDto { }

    public class LikeProfileResponseDto
    {
        public bool Success { get; set; }
        public int? NewLikeCount { get; set; }
    }
}
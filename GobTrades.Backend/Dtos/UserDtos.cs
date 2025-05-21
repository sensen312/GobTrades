// MODIFIED: DTOs for user creation for Phase 1.

using System;
using System.ComponentModel.DataAnnotations;

namespace GobTrades.Backend.Dtos
{
    public class CreateUserRequestDto
    {
        [Required]
        public string Uuid { get; set; } = null!;

        [Required]
        public string GoblinName { get; set; } = null!;

        [Required]
        public string PfpIdentifier { get; set; } = null!;
    }

    // Response for user creation, maps from UserProfile model
    public class CreateUserResponseDto
    {
        public string Id { get; set; } = null!; // MongoDB ObjectId as string
        public string Uuid { get; set; } = null!;
        public string GoblinName { get; set; } = null!;
        public string PfpIdentifier { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

using System; // Required for DateTime
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

    public class CreateUserResponseDto
    {
        public string Id { get; set; } = null!;
        public string Uuid { get; set; } = null!;
        public string GoblinName { get; set; } = null!;
        public string PfpIdentifier { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
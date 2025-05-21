// MODIFIED: Controller for profile/stall management for Phase 1.

using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq; // Required for FirstOrDefault

namespace GobTrades.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController : ControllerBase
    {
        private readonly ILogger<ProfilesController> _logger;
        private readonly IProfileService _profileService;

        public ProfilesController(ILogger<ProfilesController> logger, IProfileService profileService)
        {
            _logger = logger;
            _profileService = profileService;
        }

        [HttpGet("my-stall")]
        [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)] // If user exists but stall not yet created
        public async Task<IActionResult> GetMyStall()
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid))
            {
                _logger.LogWarning("GetMyStall: Unauthorized access attempt. X-User-UUID header missing.");
                return Unauthorized(new { message = "User UUID header is required." });
            }

            _logger.LogInformation("GET /api/profiles/my-stall called for user UUID: {UserUuid}", userUuid);
            var profileDto = await _profileService.GetMyProfileAsync(userUuid);

            if (profileDto == null)
            {
                _logger.LogInformation("No stall data found for user UUID: {UserUuid}. Client should prompt for creation.", userUuid);
                return Ok(null); 
            }
            return Ok(profileDto);
        }

        [HttpPut("my-stall")]
        [ProducesResponseType(typeof(UpdateProfileResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateMyStall([FromBody] UpdateProfileRequestDto profileData)
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid))
            {
                _logger.LogWarning("UpdateMyStall: Unauthorized access attempt. X-User-UUID header missing.");
                return Unauthorized(new { message = "User UUID header is required." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("PUT /api/profiles/my-stall called for user UUID: {UserUuid}", userUuid);
            var (updatedProfile, errorMessage) = await _profileService.UpdateMyProfileAsync(userUuid, profileData);

            if (updatedProfile == null)
            {
                _logger.LogError("Failed to update stall for user UUID: {UserUuid}. Error: {ErrorMessage}", userUuid, errorMessage);
                return BadRequest(new { message = errorMessage ?? "Failed to update stall." });
            }
            return Ok(updatedProfile);
        }
    }
}

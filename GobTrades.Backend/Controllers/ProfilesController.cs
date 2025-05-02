using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Http; // Required for StatusCodes, HttpContext
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System; // Required for StringComparison
using System.Linq; // Required for FirstOrDefault
using System.Threading.Tasks; // Required for Task

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

        [HttpGet("feed")]
        [ProducesResponseType(typeof(FetchProfilesResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFeed([FromQuery] FetchProfilesParamsDto queryParams)
        {
             string? currentUserUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            _logger.LogInformation("GET /feed called with params: {@QueryParams}", queryParams);
             var result = await _profileService.GetFeedProfilesAsync(queryParams, currentUserUuid);
            return Ok(result);
        }

        [HttpGet("my-stall")]
        [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)] // Note: Can return null UserProfileDto
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetMyStall()
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid))
            {
                return Unauthorized("User UUID header is required.");
            }
            _logger.LogInformation("GET /my-stall called for user: {UserUuid}", userUuid);
            var profile = await _profileService.GetMyProfileAsync(userUuid);
            // Return OK with null if profile doesn't exist yet, frontend handles this
            return Ok(profile);
        }

        [HttpGet("{uuid}")]
        [ProducesResponseType(typeof(FetchProfileResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfileByUuid(string uuid)
        {
             string? currentUserUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            _logger.LogInformation("GET /profiles/{TargetUuid} called", uuid);
             var profile = await _profileService.GetProfileByUuidAsync(uuid, currentUserUuid);
             if (profile == null) return NotFound($"Profile with UUID '{uuid}' not found.");
             return Ok(profile);
        }

        [HttpPut("my-stall")]
        [ProducesResponseType(typeof(UpdateProfileResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateMyStall([FromBody] UpdateProfileRequestDto profileData)
        {
            string? userUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(userUuid)) return Unauthorized("User UUID header is required.");

             if (profileData.Items.Count > 10) return BadRequest("Maximum of 10 items allowed.");
             if (profileData.OfferedItemTags.Count > 4 || profileData.WantsTags.Count > 4) return BadRequest("Maximum of 4 tags allowed per category.");

            _logger.LogInformation("PUT /my-stall called for user: {UserUuid}", userUuid);
            var (updatedProfile, errorMessage) = await _profileService.UpdateMyProfileAsync(userUuid, profileData);
            if (updatedProfile == null) return BadRequest(errorMessage ?? "Failed to update profile.");
            return Ok(updatedProfile);
        }

        [HttpPost("{targetUserUuid}/like")]
        [ProducesResponseType(typeof(LikeProfileResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> LikeProfile(string targetUserUuid)
        {
            string? likerUuid = HttpContext.Request.Headers["X-User-UUID"].FirstOrDefault();
            if (string.IsNullOrEmpty(likerUuid)) return Unauthorized("User UUID header is required.");
            if (likerUuid == targetUserUuid) return BadRequest("Users cannot like their own profile.");

            _logger.LogInformation("POST /like called by {LikerUuid} for {TargetUserUuid}", likerUuid, targetUserUuid);
            var (success, newLikeCount, errorMessage) = await _profileService.LikeProfileAsync(likerUuid, targetUserUuid);
             if (!success) return BadRequest(errorMessage ?? "Failed to like profile.");
            return Ok(new LikeProfileResponseDto { Success = true, NewLikeCount = newLikeCount });
        }
    }
}
// MODIFIED: Controller for user creation.

using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System; // Required for StringComparison

namespace GobTrades.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IProfileService _profileService; // ProfileService handles user creation logic

        public UsersController(ILogger<UsersController> logger, IProfileService profileService)
        {
            _logger = logger;
            _profileService = profileService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(CreateUserResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(string), StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto userData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("POST /api/users called for UUID: {UserUuid}", userData.Uuid);
            var (userResponse, errorMessage) = await _profileService.CreateInitialUserAsync(userData);

            if (userResponse == null)
            {
                if (errorMessage != null && errorMessage.Contains("already exists", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("Conflict: User with UUID {UserUuid} already exists.", userData.Uuid);
                    return Conflict(new { message = errorMessage });
                }
                _logger.LogError("Bad Request: Failed to create user. Error: {ErrorMessage}", errorMessage);
                return BadRequest(new { message = errorMessage ?? "Failed to create user." });
            }

            _logger.LogInformation("User created successfully. DB ID: {DbId}, UUID: {UserUuid}", userResponse.Id, userResponse.Uuid);
            return CreatedAtAction(
                actionName: nameof(ProfilesController.GetMyStall), 
                controllerName: "Profiles", 
                routeValues: new { /* uuid = userResponse.Uuid */ }, 
                value: userResponse
            );
        }
    }
}

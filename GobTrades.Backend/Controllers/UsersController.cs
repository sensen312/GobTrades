using GobTrades.Backend.Dtos;
using GobTrades.Backend.Services;
using Microsoft.AspNetCore.Http; // Required for StatusCodes
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System; // Required for StringComparison
using System.Threading.Tasks; // Required for Task

namespace GobTrades.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IProfileService _profileService;

        public UsersController(ILogger<UsersController> logger, IProfileService profileService)
        {
            _logger = logger;
            _profileService = profileService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(CreateUserResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] // For user already exists
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto userData)
        {
             _logger.LogInformation("POST /users called for UUID: {UserUuid}", userData.Uuid);
             var (user, errorMessage) = await _profileService.CreateInitialUserAsync(userData);

             if (user == null)
             {
                 if (errorMessage != null && errorMessage.Contains("already exists", StringComparison.OrdinalIgnoreCase))
                 {
                     return Conflict(errorMessage);
                 }
                 return BadRequest(errorMessage ?? "Failed to create user.");
             }
             return CreatedAtAction(nameof(ProfilesController.GetProfileByUuid), "Profiles", new { uuid = user.Uuid }, user);
        }
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace UrlShortener.Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;

        public AuthController(ILogger<AuthController> logger, UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _logger = logger;
            _userManager = userManager;
            _config = config;
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest dto)
        {
            var user = new ApplicationUser { UserName = "test2", Email = "test2@test.com" };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User"); // default role
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized();

            var token = GenerateJwt(user, await _userManager.GetRolesAsync(user));

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddHours(2)
            });

            return Ok();
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(
                "access_token",
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/"
                });

            return Ok();
        }

        private string GenerateJwt(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
                                        {
                                            new(JwtRegisteredClaimNames.Email, user.Email!),
                                        };

            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}

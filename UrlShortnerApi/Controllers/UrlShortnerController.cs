using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UrlShortnerApi.Services;

namespace UrlShortnerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrlShortnerController : ControllerBase
    {

        private readonly ILogger<UrlShortnerController> _logger;

        // In-memory store for demo purposes — swap with a database in production
        private static readonly Dictionary<string, string> _urlStore = new();
        private static readonly Random _random = new();
        private readonly ShortUrlService _shortUrlService;
        public UrlShortnerController(ILogger<UrlShortnerController> logger, ShortUrlService urlService)
        {
            _logger = logger;
            _shortUrlService = urlService;
        }

        [HttpPost("AddUrl")]
        [Authorize]
        public IActionResult AddUrl([FromBody] ShortenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.OriginalUrl))
                return BadRequest("URL cannot be empty.");

            if (!Uri.TryCreate(request.OriginalUrl, UriKind.Absolute, out _))
                return BadRequest("Invalid URL format.");

            if (request.UserId == null)
                return BadRequest($"Invalid User: {request.UserId}");

            var shortCode = _shortUrlService.CreateShortUrl(request.OriginalUrl, request.UserId);
            
            if (shortCode == null)
                return Problem(
                            detail: "An unexpected database error occurred.",
                            statusCode: StatusCodes.Status500InternalServerError,
                            title: "Server Error"
                        );

            var shortUrl = $"{Request.Scheme}://{Request.Host}/api/url/{shortCode}";
            return Ok(new { shortUrl, shortCode });
        }

        // GET: api/url/{code}
        [HttpGet("{code}")]
        public IActionResult RedirectToOriginal(string code)
        {
            var originalUrl = _shortUrlService.GetOriginalUrl(code);
            if (originalUrl == null)
                return NotFound("Short URL not found.");

            return Redirect(originalUrl);
        }

        // GET: api/url/all (optional, for debugging/demo)
        [HttpGet("all")]
        [Authorize]
        public IActionResult GetAll()
        {
            return Ok(_urlStore);
        }

        private string GenerateShortCode(int length = 6)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var code = new string(Enumerable.Repeat(chars, length)
                .Select(s => s[_random.Next(s.Length)]).ToArray());

            // Ensure uniqueness (very small collision chance, but handle it anyway)
            while (_urlStore.ContainsKey(code))
                code = GenerateShortCode(length);

            return code;
        }
    }

    public class ShortenRequest
    {
        public string OriginalUrl { get; set; } = string.Empty;
        public string? UserId { get; set; }
    }
}

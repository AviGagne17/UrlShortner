using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace UrlShortnerApi
{
    public class Url
    {
        [Key]
        public string ShortUrl { get; set; }

        public string OriginalUrl { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}

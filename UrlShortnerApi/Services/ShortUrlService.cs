using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace UrlShortnerApi.Services
{
    public class ShortUrlService
    {
        private readonly ApplicationDbContext dbContext;
        public ShortUrlService(ApplicationDbContext dbContext) 
        { 
            this.dbContext = dbContext;
        }

        public IEnumerable<Url> GetAllUrls()
        {
            return dbContext.Urls;
        }

        public string? GetOriginalUrl(string shortUrl)
        {
            return dbContext.Urls.FirstOrDefault(u => u.ShortUrl == shortUrl)?.OriginalUrl;
        }

        public async Task<string?> DeleteShortUrl(string shortUrl)
        {
            try
            {
                var url = dbContext.Urls.FirstOrDefault(x => x.ShortUrl == shortUrl);
                if (url == null)
                {
                    return null;
                }

                dbContext.Urls.Remove(url);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                return string.Empty;
            }

            return shortUrl;
        }

        public async Task<string?> UpdateUrl(string shortUrl, string originalUrl, string userId)
        {
            try
            {
                var url = dbContext.Urls.FirstOrDefault(x => x.ShortUrl == shortUrl && x.UserId == userId);
                
                if (url == null)
                {
                    return null;
                }

                url.OriginalUrl = originalUrl;
                await dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                return string.Empty;
            }

            return shortUrl;
        }

        public async Task<string?> CreateShortUrl(string originalUrl, string userId)
        {
            var shortUrl = GenerateShortCode(originalUrl);

            var url = new Url();
            url.ShortUrl = shortUrl;
            url.OriginalUrl = originalUrl;
            url.CreatedAt = DateTimeOffset.UtcNow;
            url.UserId = userId;

            try
            {
                await dbContext.Urls.AddAsync(url);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                return null;
            }

            return shortUrl;
        }

        private const string Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        public string GenerateShortCode(string originalUrl)
        {
            // 1. Hash the original URL using SHA-256
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(originalUrl));

            // 2. Map the first 6 bytes of the hash into Base62 characters
            var result = new char[6];
            for (int i = 0; i < 6; i++)
            {
                result[i] = Alphabet[hashBytes[i] % Alphabet.Length];
            }

            return new string(result);
        }


    }
}

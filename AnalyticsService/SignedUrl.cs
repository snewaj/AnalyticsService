using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace AnalyticsService
{
    
    [ApiController]
    [Route("api")]
    public class GoogleStorageController : ControllerBase
    {
        private readonly string _bucketName = "your-bucket-name"; // Replace with your Google Cloud Storage bucket name

        [HttpPost("getSignedUrl")]
        public async Task<ActionResult<string>> GetSignedUrl([FromBody] FileRequest fileRequest)
        {
            try
            {
                var credential = GoogleCredential.FromFile("path-to-your-service-account-key.json"); // Replace with your service account key path
                var storage = StorageClient.Create(credential);

                var fileName = fileRequest.FileName;
                var contentType = fileRequest.ContentType;

                var options = new Google.Cloud.Storage.V1.UrlSignerOptions
                {
                    Version = "v4",
                    Expiration = DateTime.UtcNow.AddMinutes(10), // Set the expiration time as needed
                };

                var storageObject = new Google.Apis.Storage.v1.Data.Object
                {
                    Bucket = _bucketName,
                    Name = fileName,
                    ContentType = contentType,
                };

                var url = storage.SignObject(storageObject, options);

                return Ok(url);
            }
            catch (Exception ex)
            {
                // Handle errors appropriately
                return BadRequest($"Error generating signed URL: {ex.Message}");
            }
        }
    }

    public class FileRequest
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
}

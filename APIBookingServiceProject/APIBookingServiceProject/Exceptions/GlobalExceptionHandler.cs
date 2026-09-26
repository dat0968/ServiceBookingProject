using Microsoft.AspNetCore.Diagnostics;

namespace APIBookingServiceProject.Exceptions
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "An exception occurred: {Message}", exception.Message);
            var statusCodeResponse = exception switch
            {
                NotFoundException => StatusCodes.Status404NotFound,

                BadRequestException => StatusCodes.Status400BadRequest,

                _ => StatusCodes.Status500InternalServerError
            };
            httpContext.Response.StatusCode = statusCodeResponse;

            await httpContext.Response.WriteAsJsonAsync(
                new
                {
                    statusCode = statusCodeResponse,
                    message = exception.Message
                },
                cancellationToken
            );

            return true;
        }
    }
}

using System.Net;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Application.core;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Middleware
{
    /// <summary>
    /// Class that handles the exception middleware
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
            IHostEnvironment env)
        {
            this._env = env;
            this._logger = logger;
            this._next = next;
        }

        /// <summary>
        ///  middleware that passess to next middleware if everything is correct else configure the response and throw exception
        /// </summary>
        /// <param name="context"></param>
        /// <returns>
        /// response
        /// </returns>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                //run the context i.e next middleware
                await this._next(context);
            }
            catch (Exception ex)
            {
                //log error to console
                this._logger.LogError(ex, ex.Message);

                //configuring response
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = this._env.IsDevelopment()
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace.ToString())
                    : new AppException(context.Response.StatusCode, "Server Error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
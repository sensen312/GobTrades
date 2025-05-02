using GobTrades.Backend.Data;
using GobTrades.Backend.Hubs;
using GobTrades.Backend.Models;
using GobTrades.Backend.Services;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json.Serialization;
using System.Collections.Generic; // Required for List
using System.Linq; // Required for Any/ToArray
using System; // Required for Console
using Microsoft.AspNetCore.Http; // Required for HttpContext, HeaderDictionary
using System.Threading.Tasks; // Required for Task

var builder = WebApplication.CreateBuilder(args);

// 1. Configuration
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddSingleton<MongoDbSettings>(sp => sp.GetRequiredService<IOptions<MongoDbSettings>>().Value);

var corsSettings = builder.Configuration.GetSection("CorsSettings").Get<CorsSettings>();
var specificOriginsPolicy = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: specificOriginsPolicy,
                      policyBuilder =>
                      {
                           if (corsSettings?.AllowedOrigins != null && corsSettings.AllowedOrigins.Any())
                           {
                                policyBuilder.WithOrigins(corsSettings.AllowedOrigins.ToArray())
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                                Console.WriteLine($"CORS Enabled for Origins: {string.Join(", ", corsSettings.AllowedOrigins)}");
                           }
                           else
                           {
                               policyBuilder.AllowAnyOrigin()
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                               Console.WriteLine("Warning: CORS Allowed Origins not configured in appsettings. Allowing any origin.");
                           }
                      });
});

// 2. Services
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<ITradeService, TradeService>();
builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
         options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
    Console.WriteLine("Development environment detected. Swagger UI enabled at /swagger");
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(specificOriginsPolicy);
Console.WriteLine("CORS policy applied.");

// app.UseAuthentication(); // Uncomment if auth is added
// app.UseAuthorization(); // Uncomment if auth is added

// Middleware to log X-User-UUID
app.Use(async (context, next) => {
    var userUuid = context.Request.Headers["X-User-UUID"].FirstOrDefault();
    // Basic logging for debug purposes
    if (!string.IsNullOrEmpty(userUuid) && !context.Request.Path.StartsWithSegments("/swagger")) {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Request {context.Request.Method} {context.Request.Path} - X-User-UUID: {userUuid.Substring(0, Math.Min(userUuid.Length, 8))}...");
    }
    await next.Invoke();
});


app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");
app.MapGet("/", () => $"GobTrades Backend API (Phase 1 - {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC)");

app.Run();

// Helper class for CORS settings
public class CorsSettings
{
    public List<string>? AllowedOrigins { get; set; }
}
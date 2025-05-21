// MODIFIED: Ensure CORS, DI for new services, and X-User-UUID middleware are correctly set up.

using GobTrades.Backend.Data;
using GobTrades.Backend.Models; // For MongoDbSettings, CorsSettings
using GobTrades.Backend.Services;
// Hubs are not used in Phase 1 backend directly, but ChatHub.cs might exist from V1
// using GobTrades.Backend.Hubs;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization; // For JsonIgnoreCondition
using Microsoft.AspNetCore.Http; // Required for HttpContext, HeaderDictionary, HttpMethods
using System.IO; // Required for Path
using Microsoft.Extensions.FileProviders; // Required for PhysicalFileProvider

var builder = WebApplication.CreateBuilder(args);

// 1. Configuration
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<MongoDbSettings>>().Value);

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
                              Console.WriteLine("Warning: CORS Allowed Origins not configured in appsettings. Allowing any origin for development.");
                          }
                      });
});

// 2. Services
builder.Services.AddSingleton<MongoDbContext>(); 
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IMarketService, MarketService>(); 

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GobTrades API V1");
        c.RoutePrefix = "swagger"; 
    });
    Console.WriteLine("Development environment. Swagger UI enabled at /swagger");
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection(); 

app.UseRouting();

app.UseCors(specificOriginsPolicy); 
Console.WriteLine("CORS policy applied.");

app.Use(async (context, next) =>
{
    var userUuid = context.Request.Headers["X-User-UUID"].FirstOrDefault();
    if (!string.IsNullOrEmpty(userUuid) && !context.Request.Path.StartsWithSegments("/swagger"))
    {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Request {context.Request.Method} {context.Request.Path} - X-User-UUID: {userUuid}");
    }
    else if (string.IsNullOrEmpty(userUuid) &&
             !context.Request.Path.StartsWithSegments("/swagger") &&
             !context.Request.Path.StartsWithSegments("/api/market/status") && 
             !(context.Request.Method == HttpMethods.Post && context.Request.Path.StartsWithSegments("/api/users")) 
            )
    {
        // Optional: Log missing UUID for relevant endpoints if desired for stricter debugging
        // Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Request {context.Request.Method} {context.Request.Path} - X-User-UUID: MISSING");
    }
    await next.Invoke();
});

app.MapControllers();
app.MapGet("/", () => $"GobTrades Backend API (Phase 1 - Profile Centric - {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC)");

// Ensure MongoDB indexes are created on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
    // EnsureIndexesCreated is called in MongoDbContext constructor now.
}

app.Run();

public class CorsSettings
{
    public List<string>? AllowedOrigins { get; set; }
}

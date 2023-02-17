using System;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        // services.AddRazorPages();
        services.AddControllers();
        services.AddSignalR()
            .AddAzureSignalR()
            .AddMessagePackProtocol();
        services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                        .AllowCredentials()
                        .WithOrigins(
                        "https://localhost:44447")
                        .AllowAnyHeader()
                        .SetIsOriginAllowed(_ => true)
                        .AllowAnyMethod();
                });
            });
        
    }

    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
        app.UseCors();
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }
        
         app.UseRouting();
            app.UseFileServer();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/signalr");
            });
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        

        app.UseAuthorization();
        // app.MapRazorPages();
        app.Run();
    }
}
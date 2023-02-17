
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;


namespace API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly IHubContext<ChatHub> hubContext;

    public ChatController(IHubContext<ChatHub> hubContext)
    {
        this.hubContext = hubContext;
    }

    [HttpPost]
    public async Task SendMessage(ChatMessage message)
    {
        //additional business logic 
        Console.WriteLine("MESSAG",message.Text);
        await this.hubContext.Clients.All.SendAsync("messageReceivedFromApi", message);

        //additional business logic 
    }
}
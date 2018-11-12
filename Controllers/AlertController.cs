using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using myapp.Data.Models;
using System.Globalization;
using System.Net.Mail;
using System.Net;
using ClientApp.ViewModels;

namespace myapp.Controllers
{
    [Route("api/[controller]")]
    public class AlertController : Controller
    {

        [HttpPost("send")]
        [ProducesResponseType(200, Type = typeof(NotificationViewModel))]
        public async Task<ActionResult> Send([FromBody]NotificationViewModel nv )
        {
            WebScrapController ws = new WebScrapController();
            //List<Advertisement> ad = ws.getAdvertisements();
            //List<string> strings = ad.Select(s => s.Title).ToList();
            var smtpClient = new SmtpClient
            {
                Host = "smtp.gmail.com", // set your SMTP server name here
                Port = 587, // Port 
                EnableSsl = true,
                Credentials = new NetworkCredential("mwenjie@gmail.com", "nbhrxhjzgmhfovxx")
            };

            using (var message = new MailMessage("mwenjie@gmail.com", "mwenjie@gmail.com")
            {
                Subject = nv.subject,
                Body = "Hello"
                //Body = string.Join( "\n", strings.ToArray())
            }
            )
            {
                //await smtpClient.SendMailAsync(message);
                await Task.Delay(5000);
            }

            return Ok(nv);
        }


    }
}






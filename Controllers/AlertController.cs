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
        public async Task<ActionResult> Send([FromBody]NotificationViewModel nv)
        {
            var countOfAdvertisementToSent = nv.advertisement.Where(s => s.seen == false).Count();
             Console.WriteLine("Count of unseen:" + countOfAdvertisementToSent);
            if (countOfAdvertisementToSent == 0)
            {
                return Ok();
            }
            WebScrapController ws = new WebScrapController();
            Console.WriteLine("Email receipient:" + nv.email);

            var smtpClient = new SmtpClient
            {
                Host = "smtp.gmail.com", // set your SMTP server name here
                Port = 587, // Port 
                EnableSsl = true,
                Credentials = new NetworkCredential("mwenjie@gmail.com", "nbhrxhjzgmhfovxx")
            };

            using (var message = new MailMessage("mwenjie@gmail.com", nv.email)
            {
                Subject = nv.subject,
                Body = string.Join("\n", nv.advertisement.Where(s => s.seen == false).Select(s => s.title + "|" + s.price + "|" + s.location).ToList().ToArray())
                //string.Join("\n", strings.ToArray())
            }
            )
            {
                await smtpClient.SendMailAsync(message);
            }

            return Ok();
        }
    }
}






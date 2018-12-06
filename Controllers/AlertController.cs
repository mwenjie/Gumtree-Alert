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
        public async Task<ActionResult> Send([FromBody]AlertViewModel nv)
        {
            if(nv.advertisements is null){
                return Ok();
            }
            WebScrapController ws = new WebScrapController();
            Console.WriteLine("Email receipient:" + nv.email);
            //var strings = (await ws.getAdvertisements(nv)).Where(s => s.Price >= nv.min && s.Price <= nv.max).Select(s => s.Title + "|" + s.Price + "|" + s.Location).ToList();
            //var strings = nv.advertisements.Select(s => s.Title + "|" + s.Price + "|" + s.Location).ToList();

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
                Body = nv.advertisements
                //string.Join("\n", strings.ToArray())
            }
            )
            {
                await smtpClient.SendMailAsync(message);
            }

            return Ok();
        }

        /* 
                [HttpPost("send")]
                [ProducesResponseType(200, Type = typeof(NotificationViewModel))]
                [ProducesResponseType(400)]
                public async Task<ActionResult> Send([FromBody]NotificationViewModel nv)
                {
                    WebScrapController ws = new WebScrapController();
                    Console.WriteLine("Id of notification:" + nv.id);
                    try
                    {
                        List<Advertisement> ad = await ws.getAdvertisements(nv);
                        List<string> strings = ad.Where(s => s.Price >= nv.min && s.Price <= nv.max).Select(s => s.Title + "|" + s.Price + "|" + s.Location).ToList();

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
                            Body = string.Join("\n", strings.ToArray())
                        }
                        )
                        {
                            await smtpClient.SendMailAsync(message);
                            await Task.Delay(5000);
                        }

                        return Ok(nv);
                    }
                    catch (Exception ex)
                    {
                        return  BadRequest(ex.Message);
                    }
                }
                */
    }
}






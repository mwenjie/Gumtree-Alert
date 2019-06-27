using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Xml;
using HtmlAgilityPack;
using Newtonsoft.Json;
using myapp.Data.Models;
using System.Globalization;
using ClientApp.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace myapp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class WebScrapController : Controller
    {
        [HttpPost("query")]
        [ProducesResponseType(200, Type = typeof(NotificationViewModel))]
        [ProducesResponseType(404)]
        public async Task<ActionResult> getAdvertisements([FromBody]NotificationViewModel nv)
        {
            List<AdvertisementViewModel> ad = new List<AdvertisementViewModel>();
            var html = nv.url;
            HtmlWeb web = new HtmlWeb();
            var htmlDoc = await web.LoadFromWebAsync(html);

            var htmlNodes = htmlDoc.DocumentNode.SelectNodes("//*/div[2]/div[1]/p[1]");
            
            if (htmlNodes is null){ //scrapping got nothing
                return NotFound();
            }

            foreach (var node in htmlNodes)
            {
                AdvertisementViewModel a = new AdvertisementViewModel();
                var nodeParent = node.ParentNode.ParentNode.ParentNode;
                var label = nodeParent.GetAttributeValue("aria-label", "");
                var id = nodeParent.GetAttributeValue("id", "");
                var s = label.Split("\n", StringSplitOptions.None);
                a.id = id;
                //a.Id = Convert.ToInt32(id.Replace("user-ad-", ""));
                a.title = s[0].Trim();
                var p = s[1].Trim().Replace("Price: ", "")
                                               .Replace(" negotiable", "")
                                               .Replace(".", "")
                                               .Replace("$", "")
                                               .Replace(",", "");
                var result = 0;
                if (Int32.TryParse(p, out result))
                    a.price = result;

                var s2 = s[2].Split(". Ad listed ");
                a.location = s2[0].Trim().Replace("Location: ", "");

                var result1 = DateTime.Now;
                if(DateTime.TryParseExact(s2[1].Trim().Replace(".", ""),"dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out result1))
                    a.dateListed = result1;
                a.seen = false;
                ad.Add(a);
            }
            nv.advertisement = ad.Where(s => s.price >= nv.min && s.price <= nv.max).ToList();
            return Ok(nv);

        }

    }
}






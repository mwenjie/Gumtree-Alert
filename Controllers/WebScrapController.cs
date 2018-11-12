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

namespace myapp.Controllers
{
    [Route("api/[controller]")]
    public class WebScrapController : Controller
    {

        public List<Advertisement> getAdvertisements(NotificationViewModel nv)
        {
            List<Advertisement> ad = new List<Advertisement>();
            var html = @"https://www.gumtree.com.au/s-g4560/k0";
            HtmlWeb web = new HtmlWeb();
            var htmlDoc = web.Load(html);
            var htmlNodes = htmlDoc.DocumentNode.SelectNodes("//*/div[2]/div[1]/p[1]");
            foreach (var node in htmlNodes)
            {
                Advertisement a = new Advertisement();
                var nodeParent = node.ParentNode.ParentNode.ParentNode;
                var label = nodeParent.GetAttributeValue("aria-label", "");
                var id = nodeParent.GetAttributeValue("id", "");
                var s = label.Split("\n", StringSplitOptions.None);
                a.Id = Convert.ToInt32(id.Replace("user-ad-", ""));
                a.Title = s[0].Trim();
                var p = s[1].Trim().Replace("Price: ", "")
                                               .Replace(" negotiable", "")
                                               .Replace(".", "")
                                               .Replace("$", "")
                                               .Replace(",", "");
                var result = 0;
                if (Int32.TryParse(p, out result))
                    a.Price = result;

                var s2 = s[2].Split(". Ad listed ");
                a.Location = s2[0].Trim().Replace("Location: ", "");

                var result1 = DateTime.Now;
                //if(DateTime.TryParseExact(s2[1].Trim().Replace(".", ""),"dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out result1))
                a.DateListed = DateTime.Now;
                ad.Add(a);
            }

            return ad;

        }

    }
}






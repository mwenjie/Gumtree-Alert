
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ClientApp.ViewModels
{
    public class AdvertisementViewModel
    {
        public string id { get; set; }

         public string title { get; set; }

        public int price { get; set; }

        public string location { get; set; }

        public DateTime dateListed { get; set; }

        public Boolean seen { get; set; }

    }
}
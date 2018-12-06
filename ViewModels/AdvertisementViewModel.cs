
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ClientApp.ViewModels
{
    public class AdvertisementViewModel
    {
        public string Id { get; set; }

         public string Title { get; set; }

        public int Price { get; set; }

        public string Location { get; set; }

        public DateTime DateListed { get; set; }


    }
}
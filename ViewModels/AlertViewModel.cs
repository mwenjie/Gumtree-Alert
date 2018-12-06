
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ClientApp.ViewModels
{
    public class AlertViewModel
    {
        public int notificationId { get; set; }
        public string email { get; set; }

         public string subject { get; set; }

        public string advertisements{ get; set; }

        public List<AdvertisementViewModel> advertisement{ get; set;}
    }
}
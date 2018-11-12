
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ClientApp.ViewModels
{
    public class NotificationViewModel
    {
        public int id { get; set; }
        public string subject { get; set; }
        public string url { get; set; }
        public string email { get; set; }
        public string frequency { get; set; }
    }



}
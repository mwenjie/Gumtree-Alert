using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myapp.Data.Models
{
    public class Advertisement
    {
        #region Constructor
        public Advertisement()
        {

        }
        #endregion

        #region Properties
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public int Price { get; set; }

        public string Location { get; set; }

        public DateTime DateListed { get; set; }

        #endregion

    }
}
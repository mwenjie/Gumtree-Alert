using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Linq;
using myapp.Data.Models;

namespace myapp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        #region Constructor
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
        #endregion Constructor

        #region Methods
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
        }
        #endregion Methods
    }
}

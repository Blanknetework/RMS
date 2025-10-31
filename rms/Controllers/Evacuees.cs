using Microsoft.AspNetCore.Mvc;

namespace rms.Controllers
{
    public class Evacuees : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

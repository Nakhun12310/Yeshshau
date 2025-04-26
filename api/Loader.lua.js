export default function handler(req, res) {
  // Remove or relax the referer check
  // Optional: You can still add some security checks if you need to

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`
    print("Script loaded!")
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
  `);
}

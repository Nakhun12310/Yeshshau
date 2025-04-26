export default function handler(req, res) {
  const referer = req.headers.referer;

  // Optional: Validate the referer to ensure it comes from your website or trusted sources
  if (!referer || !referer.includes('yourwebsite.com')) {
    return res.status(403).send('Access Denied');
  }

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`
    print("Script loaded!")
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
  `);
}

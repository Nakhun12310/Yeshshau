export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`
print("Script loaded!")
loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
  `);
}

export default function handler(req, res) {
  // Here you could add additional security measures, like checking for a valid API key or referer
  
  // Set header to indicate plain text response (for Lua script)
  res.setHeader('Content-Type', 'text/plain');
  
  // Send the Lua script only to authorized requests
  res.status(200).send(`
print("Script loaded!")
loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
  `);
}

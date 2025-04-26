export default function handler(req, res) {
  // You can add extra checks here (e.g., check for valid referer or tokens if necessary)
  
  // Set header for plain text (Lua script)
  res.setHeader('Content-Type', 'text/plain');
  
  // Return the Lua script only when requested from an API call
  res.status(200).send(`
    print("Script loaded!")
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
  `);
}

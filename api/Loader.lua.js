export default async function handler(req, res) {
  const blacklistUrl = "https://raw.githubusercontent.com/Nakhun12310/Blacklisted/main/User.lua";
  const hubScriptUrl = "https://raw.githubusercontent.com/CookieHubScript/CookieLoader/main/Script.lua";

  try {
    // Fetch the blacklist from GitHub
    const response = await fetch(blacklistUrl);
    const text = await response.text();

    // Extract usernames from the Lua file
    const blacklistedUsers = [];
    const regex = /"(.-)"/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      blacklistedUsers.push(match[1]);
    }

    // Get the player name (this assumes the script is running on Roblox)
    const playerName = req.query.playerName;  // Pass playerName via the query param

    if (blacklistedUsers.includes(playerName)) {
      // If player is blacklisted, return a message or block loading the hub
      res.status(403).send(`You are blacklisted from using this hub, ${playerName}.`);
    } else {
      // Otherwise, load the main hub script
      const hubScript = await fetch(hubScriptUrl);
      const hubText = await hubScript.text();
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(hubText);
    }
  } catch (error) {
    res.status(500).send("Failed to load blacklist or hub.");
  }
}

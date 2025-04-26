export default async function handler(req, res) {
  const blacklistUrl = "https://raw.githubusercontent.com/Nakhun12310/Blacklisted/main/User.lua";  // Correct URL
  const hubScriptUrl = "https://raw.githubusercontent.com/CookieHubScript/CookieLoader/main/Script.lua";

  try {
    // Fetch the blacklist from GitHub
    const response = await fetch(blacklistUrl);
    const text = await response.text();

    // Log the raw text to see if it’s fetched correctly
    console.log("Fetched blacklist:", text);

    // Extract usernames from the Lua file using regex
    const blacklistedUsers = [];
    const regex = /"(.-)"/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      blacklistedUsers.push(match[1]);
    }

    // Log the blacklisted users
    console.log("Blacklisted users:", blacklistedUsers);

    // Get the player name (this assumes the script is running on Roblox)
    const playerName = req.query.playerName;  // Pass playerName via the query param
    console.log("Player Name:", playerName);

    // Check if the player is blacklisted
    if (blacklistedUsers.includes(playerName)) {
      // If player is blacklisted, return a message
      console.log(`${playerName} is blacklisted`);
      res.status(403).send(`You are blacklisted from using this hub, ${playerName}.`);
    } else {
      // Otherwise, load the main hub script
      const hubScript = await fetch(hubScriptUrl);
      const hubText = await hubScript.text();
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(hubText);
    }
  } catch (error) {
    // Handle errors if something goes wrong
    console.error("Error fetching blacklist or hub:", error);
    res.status(500).send("Failed to load blacklist or hub.");
  }
}

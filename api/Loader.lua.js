export default async function handler(req, res) {
  const blacklistUrl = "https://raw.githubusercontent.com/Nakhun12310/Blacklisted/main/User.lua";  // Correct URL
  const hubScriptUrl = "https://raw.githubusercontent.com/CookieHubScript/CookieLoader/main/Script.lua";

  try {
    // Log when the request is received
    console.log("Received request to Loader.lua");

    // Fetch the blacklist from GitHub
    const response = await fetch(blacklistUrl);
    const text = await response.text();

    // Log the fetched text to confirm it's being fetched correctly
    console.log("Fetched blacklist:", text);

    if (!text) {
      res.status(500).send("Blacklist is empty or failed to fetch.");
      return;
    }

    // Extract usernames from the Lua file using regex
    const blacklistedUsers = [];
    const regex = /"(.-)"/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      blacklistedUsers.push(match[1]);
    }

    // Log the blacklisted users
    console.log("Blacklisted users:", blacklistedUsers);

    // Get the player name from the query parameter
    const playerName = req.query.playerName;  // Pass playerName via the query param
    console.log("Player Name:", playerName);

    // Ensure playerName is passed and not empty
    if (!playerName) {
      res.status(400).send("Player name is missing.");
      return;
    }

    // Check if the player is blacklisted
    if (blacklistedUsers.includes(playerName)) {
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

// /api/verifydiscord.js

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;  // Fetch the bot token securely
const SERVER_ID = '1349958402637561968';  // Your server ID

let isReady = false;
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  isReady = true;
});

client.login(BOT_TOKEN);

export default async function handler(req, res) {
  if (!isReady) {
    return res.status(503).json({ success: false, error: "Bot not ready yet." });
  }

  const { userId } = req.query; // the Discord user ID passed from frontend

  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    const member = await guild.members.fetch(userId);

    if (member) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (error) {
    return res.status(404).json({ success: false, error: "Not a member or error." });
  }
}

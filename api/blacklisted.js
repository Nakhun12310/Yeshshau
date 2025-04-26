export default async function handler(req, res) {
  const blacklistUrl = "https://raw.githubusercontent.com/Nakhun12309/Blacklisted/main/User.lua";

  try {
    const response = await fetch(blacklistUrl);
    const text = await response.text();

    const users = [];
    const regex = /"(.-)"/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      users.push(match[1]);
    }

    let html = `<html><head><title>Blacklist</title></head><body style="background-color:black;color:white;font-family:sans-serif;">`;
    html += `<h1>Blacklisted Users</h1><ul>`;

    for (const user of users) {
      html += `<li>${user}</li>`;
    }

    html += `</ul></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Failed to load blacklist.");
  }
}

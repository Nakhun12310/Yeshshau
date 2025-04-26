export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

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
      const name = data.name || 'Unknown';
      const message = data.message || 'No message';

      // Send to your Discord webhook
      const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL'; // <<< PUT YOUR WEBHOOK HERE

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Skid Message**\n**Name:** ${name}\n**Message:** ${message}`
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
              alert('Please fill both fields!');
              return;
            }

            fetch(window.location.pathname, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                message: message
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

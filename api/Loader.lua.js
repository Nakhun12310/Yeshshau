export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  if (userAgent.includes('Roblox') || userAgent === '') {
    // Roblox client loading
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`
print("Script loaded!")
loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
    `);
  } else {
    // Browser skid visiting
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
          input, button {
            padding: 10px;
            margin: 10px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <h1>WHAT ARE YOU DOING</h1>
        <p>Type your apology here:</p>
        <input type="text" id="messageBox" placeholder="I'm sorry...">
        <br>
        <button onclick="sendMessage()">Send</button>

        <script>
          function sendMessage() {
            const message = document.getElementById('messageBox').value;
            if (!message) {
              alert('Type something!');
              return;
            }

            fetch('https://discord.com/api/webhooks/1365679141168353371/MTveez8isOYXF7RSALX36yGcu-cdIYMiGh73d-2czgL1tCZiaMlmD2f-xGU9A15h2p5_', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: message
              })
            }).then(() => {
              alert('Message sent!');
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

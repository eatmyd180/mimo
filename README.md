<div align="center">🌸 MIMOSA MULTI-DEVICE 🌸</div>

<div align="center"><img src="src/mimosa.png" width="220" height="220" /><br><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&pause=1000&color=F7A8C4&center=true&vCenter=true&random=false&width=600&lines=WhatsApp+Bot+Multi-Device;Fast+%E2%9A%A1+Secure+%F0%9F%94%92+Modern+%F0%9F%9A%80;Built+with+Baileys;Created+by+HamzzDev" /><br><br>

<img src="https://img.shields.io/github/stars/eatmyd180/mimo?style=for-the-badge&color=F7A8C4">
<img src="https://img.shields.io/github/forks/eatmyd180/mimo?style=for-the-badge&color=ff69b4">
<img src="https://img.shields.io/github/license/eatmyd180/mimo?style=for-the-badge&color=blue">
<img src="https://img.shields.io/badge/Node.js-20.x-3C873A?style=for-the-badge&logo=node.js&logoColor=white"></div>---

🌷 About Project

Mimosa Multi-Device is a modern WhatsApp bot built using Baileys with support for Multi-Device connections.

Designed to be:

- ⚡ Fast
- 🔒 Secure
- 🎨 Easy to Customize
- 🚀 Stable for Deployment
- 📦 Lightweight & Modern

Perfect for personal bots, communities, and advanced WhatsApp automation.

---

✨ Main Features

<table>
<tr>
<td width="50%">🤖 Core Features

- Multi-Device Support
- Pairing Code Login
- QR Code Login
- Auto Response
- Anti Spam
- Anti Link
- Premium System
- Limit System

</td>
<td width="50%">🎮 Extra Features

- Downloader Menu
- Fun Games
- Media Converter
- Sticker Creator
- Audio & Video Tools
- Upload Center
- MongoDB Database
- Group Management

</td>
</tr>
</table>---

📸 Preview

<div align="center"><img src="https://files.catbox.moe/yourimage.png" width="700"></div>---

📦 Installation

📱 Termux Installation

pkg update && pkg upgrade -y

pkg install nodejs-lts ffmpeg webp git -y

git clone https://github.com/eatmyd180/mimo.git

cd mimo

npm install

cp .env.example .env

Edit ".env" configuration:

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret

Start the bot:

node index.js

---

🔑 Login Methods

1️⃣ Pairing Code (Recommended)

USE_PAIRING_CODE = true

- Enter your WhatsApp number
- Receive pairing code
- Link device from WhatsApp

---

2️⃣ QR Code

USE_PAIRING_CODE = false

- Scan QR using WhatsApp
- Connected instantly

---

🚀 Deployment

☁️ Railway

1. Fork repository
2. Create Railway project
3. Connect GitHub repository
4. Add environment variables
5. Deploy project

---

🖥 VPS / Ubuntu

git clone https://github.com/eatmyd180/mimo.git

cd mimo

npm install

npm install -g pm2

pm2 start index.js --name mimo

pm2 save

pm2 startup

---

📁 Project Structure

mimo/
├── src/
│   ├── plugins/
│   ├── lib/
│   ├── database/
│   └── utils/
│
├── sessions/
├── temp/
├── config.js
├── index.js
├── package.json
└── .env

---

🛠 Requirements

Package| Version
Node.js| 20.x+
MongoDB| Atlas
FFmpeg| Latest
WebP| Latest

---

📜 Commands

Use:

.menu

To display all available commands.

---

⚠️ Disclaimer

This project is still under active development.

Some features may change anytime for:

- Performance improvements
- Bug fixes
- New feature updates
- Stability optimization

---

👨‍💻 Developer

<div align="center"><a href="https://github.com/eatmyd180">
<img src="https://img.shields.io/badge/GitHub-HamzzDev-181717?style=for-the-badge&logo=github">
</a><a href="https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27">
<img src="https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
</a></div>---

🌸 Support Project

If you like this project:

⭐ Star this repository
🍴 Fork this repository
📢 Share with your friends

---

📄 License

Distributed under the MIT License.

---

<div align="center">☕ Made with love by HamzzDev

© 2026 Mimosa Multi-Device

</div>
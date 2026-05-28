<p align="center">
  <img src="src/mimosa.png" alt="Mimosa Bot" width="200" height="200">
</p>

<h1 align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=36&duration=3000&pause=500&color=F7A8C4&center=true&vCenter=true&width=600&lines=MIMOSA+MULTI-DEVICE;WhatsApp+Bot+Premium;Simple+%7C+Fast+%7C+Secure" alt="Typing SVG">
</h1>

<p align="center">
  <a href="https://github.com/eatmyd180/mimo">
    <img src="https://img.shields.io/badge/Version-7.0.0-F7A8C4?style=for-the-badge&logo=github">
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  </a>
  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-F7A8C4?style=for-the-badge&logo=opensourceinitiative">
  </a>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=eatmyd180&label=Project+Views&color=F7A8C4&style=flat-square">
</p>

---

## ✨ About

> **Mimosa Multi-Device** is a feature-rich WhatsApp bot built with Baileys. Designed to be fast, secure, and easy to use.

---

## ✨ Features

<details open>
<summary><b>📱 Core Features</b></summary>

| Category | Features |
|----------|----------|
| 🔐 **Authentication** | Multi-Device Support, Pairing Code, QR Scan |
| 🛡️ **Security** | Anti Spam, Anti Link, Limit System |
| 👑 **Premium** | Premium System with Special Perks |
| 💾 **Database** | MongoDB Persistent Storage |
| 🎮 **Entertainment** | Fun Interactive Games |
| 📥 **Downloader** | YouTube, TikTok, Instagram, Facebook |
| 🎨 **Media Tools** | Image/Video/Audio to Sticker, MP3, Voice Note |
| ☁️ **Cloud** | Media Uploader to Hamzz Cloud (E2E) |

</details>

---

## 📦 Installation

<details>
<summary><b>📋 Prerequisites</b></summary>

- Node.js 20.x or higher
- MongoDB Atlas (for database)
- FFmpeg & WebP tools

</details>

<details>
<summary><b>📱 Install on Termux</b></summary>

```bash
pkg update && pkg upgrade
pkg install nodejs-lts ffmpeg webp git
git clone https://github.com/eatmyd180/mimo.git
cd mimo
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
node index.js
```

</details>

<details>
<summary><b>🔑 Login Methods</b></summary>

Method 1: Pairing Code (Recommended)

· Set USE_PAIRING_CODE = true in index.js
· Enter your phone number when prompted
· Enter the 8-digit code in WhatsApp Linked Devices

Method 2: QR Code

· Set USE_PAIRING_CODE = false in index.js
· Scan QR code with WhatsApp

</details>

---

🚀 Deployment

<details>
<summary><b>☁️ Deploy to Railway (Recommended)</b></summary>

1. Fork this repository
2. Create new project on Railway
3. Connect your GitHub repo
4. Add environment variables:
   · MONGODB_URI
   · JWT_SECRET
5. Deploy!

</details>

<details>
<summary><b>🖥️ Deploy to VPS</b></summary>

```bash
git clone https://github.com/eatmyd180/mimo.git
cd mimo
npm install
npm install -g pm2
pm2 start index.js --name mimo
pm2 save
pm2 startup
```

</details>

---

🔧 Environment Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
```

---

📝 Usage

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=2000&pause=500&color=F7A8C4&center=true&vCenter=true&width=435&lines=Type+.menu+to+get+started!;Explore+all+commands;Enjoy+the+bot!" alt="Typing SVG">
</p>

Type .menu to see all available commands and categories.

---

⚠️ Note

This project is still in development and will continue to be updated for all features and bug maintenance.

---

📁 Project Structure

```
mimo/
├── src/
│   ├── plugins/     # Bot commands
│   ├── lib/         # Core utilities
│   └── database/    # MongoDB schemas
├── sessions/        # WhatsApp auth (gitignored)
├── index.js         # Main entry
├── config.js        # Bot configuration
└── package.json     # Dependencies
```

---

👨‍💻 Author

<p align="center">
  <a href="https://github.com/eatmyd180">
    <img src="https://img.shields.io/badge/GitHub-HamzzDev-181717?style=for-the-badge&logo=github">
  </a>
  <a href="https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27">
    <img src="https://img.shields.io/badge/WhatsApp_Channel-25D366?style=for-the-badge&logo=whatsapp">
  </a>
  <a href="https://discord.gg/your-invite">
    <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">
  </a>
</p>

---

📜 License

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-F7A8C4?style=for-the-badge">
</p>

This project is licensed under the MIT License.

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&duration=2000&pause=500&color=F7A8C4&center=true&vCenter=true&width=435&lines=Made+with+☕+by+HamzzDev;©+2025+Mimosa+Multi-Device;Thanks+for+visiting!" alt="Typing SVG">
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=F7A8C4&height=80&section=footer">
</p>
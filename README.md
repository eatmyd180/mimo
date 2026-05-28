<p align="center">  
  <img src="src/mimosa.png" alt="Mimosa Bot" width="250" height="250">  
</p>  

<h1 align="center">  
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&duration=3000&pause=500&color=F7A8C4&center=true&vCenter=true&width=500&lines=MIMOSA+MULTI-DEVICE;WhatsApp+Bot;Simple+%7C+Fast+%7C+Secure" alt="Typing SVG" />  
</h1>  

<p align="center">  
  <a href="https://github.com/eatmyd180/mimo">  
    <img src="https://img.shields.io/badge/Version-7.0.0-blue?style=for-the-badge&logo=semver&logoColor=white">  
  </a>  
  <a href="https://github.com/eatmyd180/mimo">  
    <img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js&logoColor=white">  
  </a>  
  <a href="https://github.com/eatmyd180/mimo">  
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=mit&logoColor=white">  
  </a>  
  <a href="https://github.com/eatmyd180/mimo">  
    <img src="https://img.shields.io/badge/Made%20with-☕-red?style=for-the-badge">  
  </a>
  <br>
  <a href="https://github.com/eatmyd180/mimo">
    <img src="https://visitor-badge.laobi.icu/badge?page_id=eatmyd180.mimo&style=for-the-badge&color=F7A8C4" alt="Visitors">
  </a>
</p>  

<p align="center">  
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=2000&pause=500&color=F7A8C4&center=true&vCenter=true&width=435&lines=HamzzDev;Mimosa+Multi-Device;Always+Updated" alt="Typing SVG" />  
</p>  

<img src="https://cdn.jsdelivr.net/gh/nicehash/nicehashCalc@master/github-assets/img/wave.gif" width="100%">

## 🌸 About Mimosa
Mimosa Multi-Device is a feature-rich WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys). Designed to be fast, secure, and easy to use for everyone.

<img src="https://cdn.jsdelivr.net/gh/nicehash/nicehashCalc@master/github-assets/img/wave.gif" width="100%">

## ✨ Features

| 🎯 Category | 📝 Details |
|---|---|
| 🔗 **Connection** | Multi-Device Support, Scan QR, & Pairing Code |
| 🤖 **Automation** | Auto Respon (Trigger-based automatic replies) |
| 🛡️ **Group Management** | Anti Spam, Anti Link, Keep your group safe |
| ⏳ **User System** | Limit System (Daily limits) & Premium System (Special perks) |
| 🗄️ **Database** | Persistent storage with MongoDB |
| 🎨 **Media Converter** | Image/Video/Audio to sticker, MP3, voice note |
| ☁️ **Media Uploader** | Upload to Hamzz Cloud (E2E Encryption) |
| 🎮 **Games** | Fun interactive games for groups |
| 📥 **Downloader** | YouTube, TikTok, Instagram, Facebook |

<img src="https://cdn.jsdelivr.net/gh/nicehash/nicehashCalc@master/github-assets/img/wave.gif" width="100%">

## 📦 Installation & Setup

<details>
<summary><b>🖱️ Click to view Installation Guide</b></summary>

### Prerequisites
- Node.js 20.x or higher
- MongoDB Atlas (for database)
- FFmpeg & WebP tools

### Install on Termux
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

### Login Methods

<details>
<summary><b>Method 1: Pairing Code (Recommended)</b></summary>

- Set `USE_PAIRING_CODE = true` in `index.js`
- Enter your phone number when prompted
- Enter the 8-digit code in WhatsApp Linked Devices
</details>

<details>
<summary><b>Method 2: QR Code</b></summary>

- Set `USE_PAIRING_CODE = false` in `index.js`
- Scan QR code with WhatsApp
</details>
</details>

<img src="https://cdn.jsdelivr.net/gh/nicehash/nicehashCalc@master/github-assets/img/wave.gif" width="100%">

## 🚀 Deployment

<details>
<summary><b>🌐 Deploy to Railway (Recommended)</b></summary>

1. Fork this repository
2. Create new project on [Railway](https://railway.app/)
3. Connect your GitHub repo
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
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

<img src="https://cdn.jsdelivr.net/gh/nicehash/nicehashCalc@master/github-assets/img/wave.gif" width="100%">

## 📁 Environment Variables

Create a `.env` file in the root directory and add the following:

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | Your MongoDB Connection String | ✅ Yes |
| `JWT_SECRET` | Secret key for authentication | ✅ Yes |

## 📂 Project Structure

```text
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

## 📝 Usage

Type `.menu` in WhatsApp to see all available commands and categories.

> ⚠️ **Note:** This project is still in active development and will continue to be updated for features and bug maintenance.

<img src="https://cdn.jsdelivr.net/gh/nicehash/nicehashCalc@master/github-assets/img/wave.gif" width="100%">

## 📊 Repository Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=eatmyd180&show_icons=true&theme=radical&hide_border=true&bg_color=00000000" alt="GitHub Stats" width="400">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=eatmyd180&layout=compact&theme=radical&hide_border=true&bg_color=00000000" alt="Top Languages" width="400">
</p>

## 👨‍💻 Author

<p align="center">  
  <a href="https://github.com/eatmyd180">  
    <img src="https://img.shields.io/badge/GitHub-HamzzDev-181717?style=for-the-badge&logo=github&logoColor=white">  
  </a>  
  <a href="https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27">  
    <img src="https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">  
  </a>  
</p>  

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">  
  <i>Made with ☕ by HamzzDev</i><br>  
  <i>© 2024 Mimosa Multi-Device</i><br><br>
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=15&duration=2000&pause=1000&color=F7A8C4&center=true&vCenter=true&width=300&lines=Thanks+for+visiting!;Don't+forget+to+⭐+this+repo!" alt="Typing SVG" />
</p>
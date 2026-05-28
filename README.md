<div align="center">

```
███╗   ███╗██╗███╗   ███╗ ██████╗ ███████╗ █████╗
████╗ ████║██║████╗ ████║██╔═══██╗██╔════╝██╔══██╗
██╔████╔██║██║██╔████╔██║██║   ██║███████╗███████║
██║╚██╔╝██║██║██║╚██╔╝██║██║   ██║╚════██║██╔══██║
██║ ╚═╝ ██║██║██║ ╚═╝ ██║╚██████╔╝███████║██║  ██║
╚═╝     ╚═╝╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
```

### ✦ WhatsApp Multi-Device Bot ✦

<img src="https://img.shields.io/badge/Version-7.0.0-F7A8C4?style=flat-square&labelColor=1a1a2e">
<img src="https://img.shields.io/badge/Node.js-20.x-A8D8EA?style=flat-square&labelColor=1a1a2e">
<img src="https://img.shields.io/badge/License-MIT-C9F0A8?style=flat-square&labelColor=1a1a2e">
<img src="https://img.shields.io/badge/Status-Active-F7C5A8?style=flat-square&labelColor=1a1a2e">

<br/>

*Fast · Secure · Feature-Rich · Always Updated*

</div>

---

## 〔 Overview 〕

**Mimosa** adalah WhatsApp bot multi-device bertenaga **[Baileys](https://github.com/@whiskeysockets/baileys)** — dirancang dengan fokus pada kecepatan, keamanan, dan kemudahan penggunaan. Dari manajemen grup hingga downloader media, semuanya dalam satu bot.

---

## 〔 Features 〕

| Kategori | Fitur |
|---|---|
| 🔐 **Auth** | Multi-Device · Pairing Code · QR Login |
| 🛡️ **Keamanan** | Anti Spam · Anti Link · Limit System |
| 💎 **Premium** | Sistem premium dengan akses eksklusif |
| 🗄️ **Database** | MongoDB Atlas — persistent & reliable |
| 🎬 **Media** | Convert gambar/video/audio → sticker, MP3, voice note |
| ☁️ **Upload** | Hamzz Cloud dengan enkripsi end-to-end |
| 🎮 **Games** | Mini-games interaktif di dalam chat |
| ⬇️ **Downloader** | YouTube · TikTok · Instagram · Facebook |

---

## 〔 Installation 〕

### Prerequisites

```
Node.js  ≥ 20.x
MongoDB    Atlas account
FFmpeg   + WebP tools
```

### Termux

```bash
# Update packages
pkg update && pkg upgrade

# Install dependencies
pkg install nodejs-lts ffmpeg webp git

# Clone & setup
git clone https://github.com/eatmyd180/mimo.git
cd mimo
npm install

# Configure environment
cp .env.example .env
nano .env   # isi MONGODB_URI kamu

# Jalankan
node index.js
```

---

## 〔 Login Methods 〕

**① Pairing Code** *(Direkomendasikan)*
```
1. Set  USE_PAIRING_CODE = true  di index.js
2. Masukkan nomor HP saat diminta
3. Input kode 8 digit di WhatsApp → Linked Devices
```

**② QR Code**
```
1. Set  USE_PAIRING_CODE = false  di index.js
2. Scan QR code menggunakan WhatsApp kamu
```

---

## 〔 Deployment 〕

### ▸ Railway *(Recommended)*

```
1. Fork repository ini
2. Buat project baru di Railway
3. Connect GitHub repo kamu
4. Tambahkan environment variables:
     MONGODB_URI  →  mongodb+srv://...
     JWT_SECRET   →  your_secret_key
5. Deploy!
```

### ▸ VPS / Self-hosted

```bash
git clone https://github.com/eatmyd180/mimo.git
cd mimo && npm install

# Install PM2 process manager
npm install -g pm2

# Jalankan dengan PM2
pm2 start index.js --name mimo
pm2 save
pm2 startup
```

---

## 〔 Environment Variables 〕

Buat file `.env` di root folder:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mimo

# JWT secret key (bebas, asal kuat)
JWT_SECRET=your_super_secret_key_here
```

---

## 〔 Project Structure 〕

```
mimo/
│
├── src/
│   ├── plugins/        ← Semua command bot
│   ├── lib/            ← Core utilities & helpers
│   └── database/       ← MongoDB schemas & models
│
├── sessions/           ← WhatsApp auth (gitignored)
├── index.js            ← Entry point utama
├── config.js           ← Konfigurasi bot
└── package.json        ← Dependencies
```

---

## 〔 Usage 〕

Setelah bot aktif, ketik:

```
.menu     →  Lihat semua perintah & kategori
.help     →  Bantuan penggunaan
```

---

## 〔 Author 〕

<div align="center">

**HamzzDev**

[![GitHub](https://img.shields.io/badge/GitHub-eatmyd180-181717?style=for-the-badge&logo=github)](https://github.com/eatmyd180)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27)

</div>

---

## 〔 Notice 〕

> ⚠️ Proyek ini masih aktif dikembangkan. Update fitur dan perbaikan bug akan terus dilakukan secara berkala.

---

<div align="center">

*Made with ☕ by HamzzDev · © 2024 Mimosa Multi-Device · MIT License*

</div>

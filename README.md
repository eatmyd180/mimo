<div align="center">

<img src="src/mimosa.png" width="150" height="150">

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=38&duration=3000&pause=800&color=F7A8C4&center=true&vCenter=true&width=600&lines=MIMOSA+BOT+🌸;Multi-Device+WhatsApp;Fast+%7C+Secure+%7C+Powerful" alt="Mimosa" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=2500&pause=1000&color=A8D8EA&center=true&vCenter=true&width=500&lines=Built+with+Baileys+%F0%9F%94%A5;Always+Updated+%E2%9C%A8;Made+by+HamzzDev+%E2%98%95" alt="Subtitle" />

<br/><br/>

<img src="https://img.shields.io/badge/Version-7.0.0-F7A8C4?style=for-the-badge&labelColor=2d0a1e&logo=github&logoColor=F7A8C4">
<img src="https://img.shields.io/badge/Node.js-20.x-A8D8EA?style=for-the-badge&labelColor=0a1e2d&logo=nodedotjs&logoColor=A8D8EA">
<img src="https://img.shields.io/badge/License-MIT-C9F0A8?style=for-the-badge&labelColor=0a2d0a&logoColor=C9F0A8">
<img src="https://img.shields.io/badge/Status-Active%20🟢-FFE4A8?style=for-the-badge&labelColor=2d1e0a">

<br/><br/>

<a href="#-instalasi">Instalasi</a> &nbsp;•&nbsp;
<a href="#-fitur-unggulan">Fitur</a> &nbsp;•&nbsp;
<a href="#-deployment">Deploy</a> &nbsp;•&nbsp;
<a href="#-author">Author</a>

</div>

<br/>

---

## 🌸 Overview

> **Mimosa** adalah WhatsApp bot multi-device bertenaga **[Baileys](https://github.com/@whiskeysockets/baileys)** — dirancang dengan fokus pada **kecepatan**, **keamanan**, dan **kemudahan penggunaan**. Dari manajemen grup hingga downloader media, semuanya dalam satu bot.

---

## ✨ Fitur Unggulan

<div align="center">

| 🔐 Auth | 🛡️ Keamanan | 💎 Premium |
|:---:|:---:|:---:|
| Multi-Device Support | Anti Spam | Akses Eksklusif |
| Pairing Code | Anti Link | Daily Limit |
| QR Login | Group Protect | Priority Queue |

| 🗄️ Database | 🎬 Media | ⬇️ Downloader |
|:---:|:---:|:---:|
| MongoDB Atlas | Image → Sticker | YouTube |
| Persistent Data | Video → MP3 | TikTok |
| Auto Backup | Audio → Voice Note | Instagram · Facebook |

</div>

- ☁️ **Hamzz Cloud** — Media uploader dengan enkripsi end-to-end
- 🎮 **Games** — Mini-games interaktif langsung di dalam chat
- ⚡ **Auto Respon** — Trigger-based automatic reply yang fleksibel

---

## 📦 Instalasi

### Persyaratan
```
✅  Node.js  ≥ 20.x
✅  MongoDB    Atlas account
✅  FFmpeg  +  WebP tools
```

### 📱 Termux (Android)

```bash
# ── Step 1: Update & Install Tools ──────────────────────
pkg update && pkg upgrade
pkg install nodejs-lts ffmpeg webp git

# ── Step 2: Clone Repository ────────────────────────────
git clone https://github.com/eatmyd180/mimo.git
cd mimo

# ── Step 3: Install Dependencies ────────────────────────
npm install

# ── Step 4: Setup Environment ───────────────────────────
cp .env.example .env
nano .env          # ← isi MONGODB_URI kamu di sini

# ── Step 5: Jalankan! ───────────────────────────────────
node index.js
```

---

## 🔑 Cara Login

<details>
<summary><b>① Pairing Code</b> &nbsp;— Direkomendasikan ✅</summary>
<br>

> Cara paling mudah, tanpa perlu scan kamera.

```
1. Buka file  index.js
2. Ubah      →  USE_PAIRING_CODE = true
3. Jalankan bot
4. Masukkan nomor HP kamu saat diminta
5. Buka WhatsApp → Setelan → Perangkat Tertaut
6. Input kode 8 digit yang muncul
```

</details>

<details>
<summary><b>② QR Code</b></summary>
<br>

```
1. Buka file  index.js
2. Ubah      →  USE_PAIRING_CODE = false
3. Jalankan bot
4. Scan QR code dengan WhatsApp kamu
```

</details>

---

## 🚀 Deployment

<details>
<summary><b>☁️ Railway</b> &nbsp;— Recommended</summary>
<br>

```
1.  Fork repository ini ke akun GitHub kamu
2.  Buka  railway.app  → New Project
3.  Connect GitHub repo → pilih mimo
4.  Tambahkan environment variables:
        MONGODB_URI  →  mongodb+srv://...
        JWT_SECRET   →  your_secret_key
5.  Klik Deploy — selesai! 🎉
```

</details>

<details>
<summary><b>🖥️ VPS / Self-Hosted</b></summary>
<br>

```bash
# Clone & Install
git clone https://github.com/eatmyd180/mimo.git
cd mimo && npm install

# Setup PM2 (bot tetap jalan di background)
npm install -g pm2
pm2 start index.js --name mimo
pm2 save && pm2 startup
```

</details>

---

## ⚙️ Environment Variables

Buat file `.env` di root folder:

```env
# ─── Database ───────────────────────────
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/mimo

# ─── Security ───────────────────────────
JWT_SECRET  = your_super_secret_key_here
```

---

## 🗂️ Struktur Proyek

```
mimo/
│
├── 📁 src/
│   ├── 📂 plugins/      ← Semua command bot
│   ├── 📂 lib/          ← Core utilities & helpers
│   └── 📂 database/     ← MongoDB schemas & models
│
├── 📁 sessions/         ← WhatsApp auth (gitignored)
├── 📄 index.js          ← Entry point utama
├── 📄 config.js         ← Konfigurasi bot
└── 📄 package.json      ← Dependencies
```

---

## 💬 Penggunaan

Setelah bot aktif, kirim pesan ke bot:

```
.menu    →  Lihat semua command & kategori
.help    →  Panduan penggunaan lengkap
```

---

## 👨‍💻 Author

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&pause=500&color=F7A8C4&center=true&vCenter=true&width=300&lines=HamzzDev+%E2%98%95;Always+Coding...;Never+Sleeping+%F0%9F%98…" />

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-eatmyd180-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/eatmyd180)
&nbsp;&nbsp;
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27)

</div>

---

> [!NOTE]
> 🚧 Proyek ini masih aktif dikembangkan. Fitur baru dan perbaikan bug akan terus di-update secara berkala.

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=13&duration=4000&pause=1000&color=888888&center=true&vCenter=true&width=500&lines=Made+with+☕+by+HamzzDev;© 2024 Mimosa Multi-Device · MIT License;Thank+you+for+using+Mimosa+🌸" />

</div>

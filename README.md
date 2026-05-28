<p align="center">
  <img src="src/mimosa.png" alt="Mimosa Bot" width="200" height="200" style="border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</p>

<h1 align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&duration=3000&pause=500&color=F7A8C4&center=true&vCenter=true&width=500&lines=MIMOSA+MULTI-DEVICE;WhatsApp+Bot;Simple+%7C+Fast+%7C+Secure" alt="Typing SVG" />
</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=16&duration=2000&pause=500&color=F7A8C4&center=true&vCenter=true&width=435&lines=Developed+by+HamzzDev;Always+Updated+✨" alt="Typing Subtitle" />
</p>

<p align="center">
  <a href="https://github.com/eatmyd180/mimo"><img src="https://img.shields.io/badge/Baileys-v7.0.0-blue?style=for-the-badge&logo=whatsapp&logoColor=white"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"></a>
  <a href="https://github.com/eatmyd180/mimo"><img src="https://img.shields.io/badge/License-MIT-F7A8C4?style=for-the-badge"></a>
  <br>
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-success?style=for-the-badge">
  <img src="https://img.shields.io/github/repo-size/eatmyd180/mimo?style=for-the-badge&color=orange">
</p>

---

<blockquote align="center">
  <strong>Mimosa Multi-Device</strong> adalah bot WhatsApp kaya fitur yang dibangun menggunakan library <b>Baileys</b>. Didesain untuk performa yang cepat, aman, responsif, dan tentunya mudah digunakan. 🚀
</blockquote>

---

## ✨ Features

| Fitur Utama | Deskripsi |
| :--- | :--- |
| 📱 **Multi-Device Support** | Dukungan penuh untuk pemindaian QR maupun Pairing Code. |
| 🔢 **Pairing Code** | Login instan tanpa repot scan QR (Direkomendasikan). |
| 🤖 **Auto Response** | Balasan otomatis berdasar *trigger* spesifik. |
| 🛡️ **Anti Spam & Link** | Keamanan grup ekstra untuk menjaga ketertiban. |
| 📊 **Limit System** | Pembatasan harian untuk kontrol penggunaan bot. |
| 💎 **Premium Perks** | Fitur eksklusif khusus pengguna premium. |
| 🗄️ **MongoDB Database** | Penyimpanan data yang persisten dan aman. |
| 🎨 **Media Converter** | Ubah Image/Video/Audio menjadi stiker, MP3, atau VN. |
| ☁️ **Media Uploader** | Upload terenkripsi ke Hamzz Cloud (E2E). |
| 🎮 **Mini Games** | Game interaktif untuk meramaikan grup. |
| 📥 **Sosmed Downloader** | Unduh konten dari YouTube, TikTok, IG, dan FB. |

---

## 📦 Installation

<details>
<summary><b>🛠️ Persyaratan Sistem (Klik untuk membuka)</b></summary>
<br>

Pastikan sistem kamu sudah terinstal:
- **Node.js** (Versi 20.x atau lebih baru)
- **MongoDB Atlas** (Untuk database)
- **FFmpeg & WebP** (Untuk fitur konversi media & stiker)

</details>

<details>
<summary><b>📱 Instalasi via Termux</b></summary>
<br>

Jalankan perintah berikut secara berurutan di Termux:

```bash
pkg update && pkg upgrade  
pkg install nodejs-lts ffmpeg webp git  
git clone [https://github.com/eatmyd180/mimo.git](https://github.com/eatmyd180/mimo.git)  
cd mimo  
npm install  
cp .env.example .env  

```
*Jangan lupa edit file .env dengan MongoDB URI kamu sebelum menjalankan bot!*
```bash
node index.js

```
</details>
<details>
<summary><b>🔑 Metode Login</b></summary>


**Metode 1: Pairing Code (Direkomendasikan ✨)**
 1. Ubah USE_PAIRING_CODE = true di file index.js.
 2. Jalankan bot, masukkan nomor WhatsApp kamu saat diminta.
 3. Masukkan 8 digit kode yang muncul ke menu **Perangkat Taut** di WhatsApp kamu.
**Metode 2: QR Code**
 1. Ubah USE_PAIRING_CODE = false di file index.js.
 2. Jalankan bot dan scan QR Code yang muncul di terminal menggunakan WhatsApp.
</details>
## 🚀 Deployment
<details>
<summary><b>🚂 Deploy ke Railway (Rekomendasi)</b></summary>


 1. **Fork** repositori ini ke akun GitHub kamu.
 2. Buat proyek baru di **Railway**.
 3. Hubungkan repositori GitHub yang sudah di-fork.
 4. Tambahkan *Environment Variables* berikut di pengaturan Railway:
   * MONGODB_URI
   * JWT_SECRET
 5. Klik **Deploy** dan nikmati! 🎉
</details>
<details>
<summary><b>💻 Deploy ke VPS</b></summary>


Gunakan pm2 agar bot tetap menyala di latar belakang:
```bash
git clone [https://github.com/eatmyd180/mimo.git](https://github.com/eatmyd180/mimo.git)  
cd mimo  
npm install  
npm install -g pm2  
pm2 start index.js --name mimo  
pm2 save  
pm2 startup

```
</details>
## 📁 Environment Variables
Ganti isi dari file .env dengan kredensial kamu:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster...
JWT_SECRET=rahasia_negara_jangan_disebar

```
## 📁 Project Structure
```text
mimo/  
├── src/  
│   ├── plugins/     # Modul & Perintah Bot  
│   ├── lib/         # Core Utilities & Fungsi Bantuan  
│   └── database/    # Skema MongoDB  
├── sessions/        # Folder Autentikasi WA (Gitignored)  
├── index.js         # Entry Point Utama  
├── config.js        # Konfigurasi Bot  
└── package.json     # Daftar Dependencies

```
## ⚠️ Notes
> [!NOTE]
> Proyek ini masih dalam tahap pengembangan (Development). Fitur-fitur baru dan perbaikan *bug* akan terus di-update secara berkala. Ketik .menu di dalam chat WhatsApp untuk melihat semua kategori perintah yang tersedia.
> 
## 👨‍💻 Author & Support
<p align="center">
<a href="https://github.com/eatmyd180">
<img src="https://img.shields.io/badge/GitHub-HamzzDev-181717?style=for-the-badge&logo=github">
</a>
<a href="https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27">
<img src="https://img.shields.io/badge/WhatsApp_Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
</a>
</p>
<p align="center">
<i>Dibuat dengan ☕ oleh HamzzDev</i>

<i>© 2024 Mimosa Multi-Device. Lisensi di bawah <a href="LICENSE">MIT License</a>.</i>
</p>
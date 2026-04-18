import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================================
// 📋 KONFIGURASI
// ================================
const CONFIG = {
    API_KEY: 'TLK_BOT_SECRET_2026',
    WEB_URL: 'https://mimosamd.my.id',
    ADMIN_NUMBERS: [
        '6281219048244@s.whatsapp.net',  // Hafiz
        '6289508242211@s.whatsapp.net'   // Hamzz
    ]
};

// File untuk menyimpan data pending
const TEMP_FILE = path.join(__dirname, '../../database/pending_verification.json');
const DB_DIR = path.dirname(TEMP_FILE);

// ================================
// 💾 MANAJEMEN DATA PENDING
// ================================
let pendingVerification = new Map();

// Inisialisasi folder database
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Load data dari file
if (fs.existsSync(TEMP_FILE)) {
    try {
        const data = JSON.parse(fs.readFileSync(TEMP_FILE, 'utf8'));
        pendingVerification = new Map(Object.entries(data));
        console.log(`📋 Loaded ${pendingVerification.size} pending verifications`);
    } catch (e) {
        console.error('Gagal load pending data:', e.message);
    }
}

// Simpan data ke file
function savePendingVerification() {
    const obj = Object.fromEntries(pendingVerification);
    fs.writeFileSync(TEMP_FILE, JSON.stringify(obj, null, 2));
}

// ================================
// 🌐 API CALLS KE WEB
// ================================

// Ambil detail pendaftaran
async function getRegistrationDetail(orderId) {
    try {
        const response = await fetch(`${CONFIG.WEB_URL}/api/bot/detail/${orderId}`, {
            headers: { 'x-api-key': CONFIG.API_KEY }
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        console.error('❌ Gagal ambil detail:', error.message);
        return null;
    }
}

// Update status di web
async function updateStatus(orderId, newStatus, adminNote = '') {
    try {
        const response = await fetch(`${CONFIG.WEB_URL}/api/bot/update-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONFIG.API_KEY
            },
            body: JSON.stringify({ orderId, newStatus, adminNote })
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('❌ Gagal update status:', error.message);
        return false;
    }
}

// Ambil daftar pending dari web
async function getPendingFromWeb() {
    try {
        const response = await fetch(`${CONFIG.WEB_URL}/api/bot/pending`, {
            headers: { 'x-api-key': CONFIG.API_KEY }
        });
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('❌ Gagal ambil pending dari web:', error.message);
        return [];
    }
}

// ================================
// 📝 FORMAT PESAN (Tanpa ASCII Kotak)
// ================================

// Format detail pendaftaran
function formatDetailPendaftaran(team) {
    const date = new Date(team.registeredAt);
    const formattedDate = date.toLocaleString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    let buktiText = '';
    if (team.paymentProof) {
        buktiText += `\n📸 Bukti Bayar: ${CONFIG.WEB_URL}/${team.paymentProof}`;
    }
    if (team.flyerProof) {
        buktiText += `\n📢 Bukti Brosur: ${CONFIG.WEB_URL}/${team.flyerProof}`;
    }
    
    const statusEmoji = team.status === 'waiting_verification' ? '⏳' : '🕐';
    const statusText = team.status === 'waiting_verification' 
        ? 'MENUNGGU VERIFIKASI' 
        : 'MENUNGGU PEMBAYARAN';
    
    return `
📋 *DETAIL PENDAFTARAN*
─────────────────────
🆔 ID      : ${team.orderId}
🏷️ Tim     : ${team.teamName}
👤 Ketua   : ${team.captainName}
📱 WA      : ${team.phone}
📍 Lokasi  : ${team.locationName}
💰 Biaya   : Rp ${team.price.toLocaleString('id-ID')}
📅 Waktu   : ${formattedDate}
📊 Status  : ${statusEmoji} ${statusText}
${buktiText}
─────────────────────
✅ Ketik *done*   → Konfirmasi LUNAS
❌ Ketik *batal*  → Tolak pembayaran
─────────────────────
    `.trim();
}

// Format pesan verifikasi sukses
function formatVerifikasiSukses(team, adminName) {
    return `
✅ *VERIFIKASI BERHASIL*

─────────────────────
🎉 PEMBAYARAN KONFIRMASI
─────────────────────
🆔 ID      : ${team.orderId}
🏷️ Tim     : ${team.teamName}
👤 Ketua   : ${team.captainName}
📱 WA      : ${team.phone}
💰 Biaya   : Rp ${team.price.toLocaleString('id-ID')}
📊 Status  : ✅ LUNAS
─────────────────────
🔐 Diverifikasi oleh: ${adminName}
📅 Waktu: ${new Date().toLocaleString('id-ID')}
─────────────────────

Silakan lanjut ke babak selanjutnya!
    `.trim();
}

// Format pesan verifikasi ditolak
function formatVerifikasiDitolak(team, adminName) {
    return `
❌ *VERIFIKASI DITOLAK*

─────────────────────
⚠️ PEMBAYARAN TIDAK VALID
─────────────────────
🆔 ID      : ${team.orderId}
🏷️ Tim     : ${team.teamName}
👤 Ketua   : ${team.captainName}
📊 Status  : ❌ DITOLAK
─────────────────────
🔐 Diverifikasi oleh: ${adminName}
📅 Waktu: ${new Date().toLocaleString('id-ID')}
─────────────────────

Silakan hubungi panitia untuk info lebih lanjut.
    `.trim();
}

// Format pesan notifikasi ke peserta
function formatNotifikasiPeserta(team) {
    return `
✅ *PEMBAYARAN ANDA TELAH DIKONFIRMASI*

Halo *${team.teamName}*,

Pembayaran Anda sebesar Rp ${team.price.toLocaleString('id-ID')} telah diverifikasi.

📅 Jadwal Turnamen:
   • 50 Besar (Online): 15 Agustus 2026
   • 6 Besar (Offline): 16 Agustus 2026

📍 Informasi lebih lanjut akan diinfokan via WhatsApp.

Terima kasih telah berpartisipasi! 🎮
    `.trim();
}

// ================================
// 🚀 FUNGSI UTAMA
// ================================

// Kirim pesan ke admin (opsional, untuk notifikasi)
async function sendToAdmin(sock, message) {
    for (const nomor of CONFIG.ADMIN_NUMBERS) {
        try {
            await sock.sendMessage(nomor, { text: message });
        } catch (error) {
            console.error(`Gagal kirim ke ${nomor}:`, error.message);
        }
    }
}

// Kirim notifikasi ke peserta
async function notifyParticipant(sock, team) {
    if (!team.phone) return;
    
    const participantNumber = team.phone.replace(/^0/, '62') + '@s.whatsapp.net';
    try {
        await sock.sendMessage(participantNumber, { text: formatNotifikasiPeserta(team) });
        console.log(`📱 Notifikasi terkirim ke ${team.teamName}`);
    } catch (error) {
        console.error(`Gagal kirim notifikasi ke ${team.teamName}:`, error.message);
    }
}

// ================================
// 📱 HANDLER PESAN MASUK (REPLY)
// ================================

export async function handleIncomingMessage(sock, m) {
    try {
        const messageText = m.message?.conversation || m.message?.extendedTextMessage?.text;
        if (!messageText) return;
        
        // Cek apakah ini balasan ke pesan sebelumnya
        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg) return;
        
        const quotedText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text;
        if (!quotedText || !quotedText.includes('DETAIL PENDAFTARAN')) return;
        
        // Ekstrak orderId dari pesan yang dikutip
        const orderIdMatch = quotedText.match(/🆔 ID\s*:\s*([^\n]+)/);
        if (!orderIdMatch) return;
        
        const orderId = orderIdMatch[1].trim();
        const action = messageText.toLowerCase().trim();
        
        // Ambil detail pendaftaran
        const team = await getRegistrationDetail(orderId);
        if (!team) {
            await sock.sendMessage(m.key.remoteJid, { text: '❌ Data pendaftaran tidak ditemukan!' });
            return;
        }
        
        // Dapatkan nama admin
        const adminName = m.pushName || m.key.remoteJid.split('@')[0];
        
        // Proses berdasarkan aksi
        if (action === 'done') {
            const success = await updateStatus(orderId, 'paid', `Diverifikasi oleh ${adminName}`);
            
            if (success) {
                await sock.sendMessage(m.key.remoteJid, { text: formatVerifikasiSukses(team, adminName) });
                await notifyParticipant(sock, team);
                pendingVerification.delete(orderId);
                savePendingVerification();
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: '❌ Gagal mengupdate status! Coba lagi nanti.' });
            }
            
        } else if (action === 'batal' || action === 'tolak') {
            const success = await updateStatus(orderId, 'pending', `Ditolak oleh ${adminName}`);
            
            if (success) {
                await sock.sendMessage(m.key.remoteJid, { text: formatVerifikasiDitolak(team, adminName) });
                pendingVerification.delete(orderId);
                savePendingVerification();
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: '❌ Gagal mengupdate status! Coba lagi nanti.' });
            }
        }
    } catch (error) {
        console.error('Error handleIncomingMessage:', error);
    }
}

// ================================
// 🔍 CEK PENDING MANUAL
// ================================

async function cekPendingManual(sock, chatId) {
    await sock.sendMessage(chatId, { text: '🔍 Memeriksa pendaftaran menunggu verifikasi...' });
    
    const pending = await getPendingFromWeb();
    const waitingList = pending.filter(t => t.status === 'waiting_verification');
    
    if (waitingList.length === 0) {
        await sock.sendMessage(chatId, { text: '📭 Tidak ada pendaftaran yang menunggu verifikasi.' });
        return;
    }
    
    for (const team of waitingList) {
        const detail = await getRegistrationDetail(team.orderId);
        if (detail) {
            await sock.sendMessage(chatId, { text: formatDetailPendaftaran(detail) });
            pendingVerification.set(team.orderId, {
                sender: chatId,
                teamName: team.teamName
            });
            savePendingVerification();
        }
    }
}

// ================================
// 🎯 PLUGIN COMMAND
// ================================

export default {
    cmd: ['verifikasi', 'verify', 'cek'],
    tags: ['owner'],
    ownerOnly: true,
    
    run: async (sock, m, { args }) => {
        const action = args[0]?.toLowerCase();
        const chatId = m.key.remoteJid;
        
        // Manual check pending
        if (action === 'pending') {
            await cekPendingManual(sock, chatId);
            return;
        }
        
        // Help
        await sock.sendMessage(chatId, { text: `
📋 *Cara Penggunaan Plugin Verifikasi*

─────────────────────
📌 *Perintah:*
─────────────────────
• *verifikasi pending* - Cek semua pendaftaran yang menunggu verifikasi

─────────────────────
📌 *Cara Verifikasi:*
─────────────────────
1. Bot akan kirim detail pendaftaran
2. Balas pesan tersebut dengan:
   • *done* - Konfirmasi LUNAS
   • *batal* - Tolak pembayaran

─────────────────────
⚡ Status akan otomatis berubah di website!
─────────────────────
        `.trim() });
    }
};
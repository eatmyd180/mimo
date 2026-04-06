import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
// TAMBAHAN PENTING: Import helper media dari Baileys
import { prepareWAMessageMedia } from '@whiskeysockets/baileys'; 

export default {
    cmd: ['tourl', 'upload'],
    tags: ['tools'],
    run: async (sock, m, { prefix, command }) => {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!mime) return m.reply(`*Format Salah!*\nBalas foto/video dengan perintah *${prefix + command}*`);

        await m.react('⏳');

        // Logic Ekstensi
        let ext = mime.split('/')[1]; 
        if (!ext || ext === 'plain') ext = 'txt'; 
        
        const tempFilePath = path.join(tmpdir(), `mimosa_${Date.now()}.${ext}`);
        const buffer = await q.download();
        fs.writeFileSync(tempFilePath, buffer);

        try {
            // Siapkan Media Thumbnail Sekali Saja (Agar efisien)
            // Menggunakan prepareWAMessageMedia yang benar
            const mediaHeader = await prepareWAMessageMedia(
                { image: { url: 'https://files.catbox.moe/2mq5qq.png' } }, 
                { upload: sock.waUploadToServer }
            );

            // Upload Tasks
            const uploadTasks = [];

            // Task A: Catbox
            uploadTasks.push(
                CatBox(tempFilePath, ext).then(url => ({ provider: 'Catbox.moe', url }))
            );

            // Task B: Uguu
            uploadTasks.push(
                UploadFileUgu(tempFilePath, ext).then(res => ({ provider: 'Uguu.se', url: res.url }))
            );

            // Task C: Telegraph (Khusus Gambar)
            if (mime.startsWith('image/')) {
                uploadTasks.push(
                    TelegraPh(tempFilePath).then(url => ({ provider: 'Telegra.ph', url }))
                );
            }

            const results = await Promise.allSettled(uploadTasks);
            const cards = [];

            for (const res of results) {
                if (res.status === 'fulfilled') {
                    const { provider, url } = res.value;
                    
                    cards.push({
                        header: { 
                            title: provider, 
                            hasMediaAttachment: true,
                            imageMessage: mediaHeader.imageMessage // Ambil properti imageMessage dari hasil prepare
                        },
                        body: { text: `✅ Berhasil diupload ke ${provider}` },
                        footer: { text: 'Mimosa Multi-Device' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'cta_copy',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'Copy URL',
                                    id: 'copy_url',
                                    copy_code: url
                                })
                            }]
                        }
                    });
                }
            }

            if (cards.length === 0) throw new Error('Semua server gagal/down.');

            // Kirim Carousel
            await sock.sendMessage(m.key.remoteJid, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: `✨ *Upload Success!*\n\nTipe: ${mime}\nUkuran: ${(fs.statSync(tempFilePath).size / 1024 / 1024).toFixed(2)} MB` },
                            carouselMessage: { cards }
                        }
                    }
                }
            }, { quoted: m });

            await m.react('✅');

        } catch (e) {
            console.error(e);
            await m.react('❌');
            m.reply(`❌ *Upload Gagal:* ${e.message}`);
        } finally {
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        }
    }
};

/* --- Fungsi Uploader (Tetap Sama) --- */

async function CatBox(filePath, ext) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(filePath), { filename: `file.${ext}` });
    const { data } = await axios.post('https://catbox.moe/user/api.php', form, { 
        headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } 
    });
    return data; 
}

async function UploadFileUgu(filePath, ext) {
    const form = new FormData();
    form.append('files[]', fs.createReadStream(filePath), { filename: `file.${ext}` });
    const { data } = await axios.post('https://uguu.se/upload.php', form, { 
        headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' } 
    });
    return data.files[0];
}

async function TelegraPh(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), { filename: 'image.jpg' });
    const { data } = await axios.post('https://telegra.ph/upload', form, { 
        headers: { ...form.getHeaders() } 
    });
    if (data.error) throw new Error(data.error);
    return 'https://telegra.ph' + data[0].src;
}
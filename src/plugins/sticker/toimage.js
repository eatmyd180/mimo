// plugins/sticker/toimage.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { toSmallCaps } from '../../font.js';
import webp from 'node-webpmux';
import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import crypto from 'crypto';

export default {
    cmd: ['toimage', 'toimg'],
    tags: ['sticker'],
    run: async (sock, m) => {
        try {
            // Cek apakah ada quoted message (sticker yang direply)
            const quoted = m.quoted || m;
            const msg = quoted.message || quoted;
            const type = Object.keys(msg)[0];
            
            // Validasi apakah yang direply adalah sticker
            if (type !== 'stickerMessage') {
                return m.reply(toSmallCaps('❌ *balas sticker yang ingin dijadikan gambar!*'));
            }
            
            await m.react('⏳');
            
            // Download sticker
            const stream = await downloadContentFromMessage(msg[type], 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            // Proses konversi sticker ke gambar
            let imageBuffer;
            
            try {
                // Method 1: Menggunakan node-webpmux untuk extract gambar dari WebP
                const img = new webp.Image();
                await img.load(buffer);
                
                // Dapatkan frame pertama sebagai gambar
                const frame = img.getFrame(0);
                if (frame) {
                    imageBuffer = frame;
                } else {
                    throw new Error('Tidak bisa extract frame');
                }
            } catch (webpError) {
                console.log('Webp extract error, mencoba method alternatif:', webpError);
                
                // Method 2: Simpan sementara dan konversi dengan Jimp
                const tmpPath = path.join(tmpdir(), crypto.randomBytes(6).toString('hex') + '.webp');
                fs.writeFileSync(tmpPath, buffer);
                
                try {
                    // Baca dengan Jimp
                    const image = await Jimp.read(tmpPath);
                    imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
                } finally {
                    // Hapus file sementara
                    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
                }
            }
            
            if (!imageBuffer) {
                throw new Error('Gagal mengkonversi sticker ke gambar');
            }
            
            // Kirim gambar
            await sock.sendMessage(m.key.remoteJid, {
                image: imageBuffer,
                caption: toSmallCaps('✅ *berhasil convert sticker ke gambar*'),
                contextInfo: {
                    externalAdReply: {
                        title: toSmallCaps('Mimosa Converter'),
                        body: toSmallCaps('Sticker → Image'),
                        thumbnailUrl: 'https://files.catbox.moe/2mq5qq.png',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });
            
            await m.react('✅');
            
        } catch (e) {
            console.error('ToImage Error:', e);
            await m.react('❌');
            m.reply(toSmallCaps(`❌ *error:* ${e.message}`));
        }
    }
};
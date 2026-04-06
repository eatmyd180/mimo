// plugins/sticker/sticker.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { createSticker } from '../../lib/sticker.js'; // Gunakan createSticker, bukan writeExif
import { toSmallCaps } from '../../font.js';

export default {
    cmd: ['s', 'sticker', 'stiker'],
    tags: ['sticker'],
    run: async (sock, m) => {
        try {
            const quoted = m.quoted || m;
            const msg = quoted.message || quoted;
            
            if (!msg.imageMessage && !msg.videoMessage) {
                return m.reply(toSmallCaps('❌ *balas gambar/video!*'));
            }
            
            await m.react('⏳');
            
            const type = msg.imageMessage ? 'image' : 'video';
            const stream = await downloadContentFromMessage(
                msg[type + 'Message'], 
                type
            );
            
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            // Gunakan createSticker yang sudah ada
            const stickerBuffer = await createSticker(buffer, {
                packname: global.packname || 'Mimosa Bot',
                author: global.author || '@hamzzdev'
            });
            
            await sock.sendMessage(m.key.remoteJid, {
                sticker: stickerBuffer
            }, { quoted: m });
            
            await m.react('✅');
        } catch (e) {
            console.error('Sticker Error:', e);
            await m.react('❌');
            m.reply(toSmallCaps(`❌ *error:* ${e.message}`));
        }
    }
};
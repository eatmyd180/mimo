import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { toSmallCaps } from '../../font.js';

export default {
    cmd: ['menu', 'help', 'list'],
    tags: ['general'],
    run: async (sock, m, { user, prefix, pushName, args }) => {
        const thumbPath = path.join(process.cwd(), 'src', 'mimosa.png');
        let thumbBuffer;
        try {
            thumbBuffer = fs.readFileSync(thumbPath);
        } catch (err) {
            console.error("Gambar src/mimosa.png tidak ditemukan, menggunakan URL fallback.");
            thumbBuffer = null;
        }

        const time = moment().tz('Asia/Jakarta').format('HH:mm:ss');
        const date = moment().tz('Asia/Jakarta').locale('id').format('LL');
        
        const uptime = process.uptime();
        const runtime = formatRuntime(uptime);
        
        const hour = moment().tz('Asia/Jakarta').format('HH');
        let greeting = 'Malam 🌙';
        if (hour >= 4 && hour < 11) greeting = 'Pagi ⛅';
        else if (hour >= 11 && hour < 15) greeting = 'Siang ☀️';
        else if (hour >= 15 && hour < 18) greeting = 'Sore 🌇';

        const myChannel = {
            newsletterJid: '120363204362148135@newsletter',
            newsletterName: 'Mimosa Official Info',
            serverMessageId: 100
        };

        const plugins = Object.values(global.plugins);
        const tags = {};
        
        plugins.forEach(p => {
            if (p.tags && p.tags.length > 0) {
                p.tags.forEach(t => {
                    if (!tags[t]) tags[t] = [];
                    tags[t].push(p.cmd[0]);
                });
            }
        });
        const availableTags = Object.keys(tags).sort();

        if (!args[0]) {
            let menuText = `
${toSmallCaps('Hi')} ${pushName} 👋, ${toSmallCaps('Selamat')} ${greeting}

┌  🤖 ${toSmallCaps('*BOT INFORMATION*')}
│  ◦  ${toSmallCaps('*Name*')} : Mimosa Multi-Device
│  ◦  ${toSmallCaps('*Mode*')} : Public
│  ◦  ${toSmallCaps('*Platfrom*')} : Linux
│  ◦  ${toSmallCaps('*Type*')} : Node.js (Baileys)
│  ◦  ${toSmallCaps('*Uptime*')} : ${runtime}
└  ◦  ${toSmallCaps('*Date*')} : ${date}

┌  👤 ${toSmallCaps('*USER INFORMATION*')}
│  ◦  ${toSmallCaps('*Name*')} : ${pushName}
│  ◦  ${toSmallCaps('*Status*')} : ${user.premium ? 'Premium 👑' : 'Free User'}
│  ◦  ${toSmallCaps('*Limit*')} : ${user.premium ? 'Unlimited' : user.limit}
│  ◦  ${toSmallCaps('*Level*')} : ${user.rpg.level}
└  ◦  ${toSmallCaps('*Money*')} : Rp ${user.rpg.money.toLocaleString()}

┌  📂 ${toSmallCaps('*LIST CATEGORY*')}
│  ${toSmallCaps('*Ketik*')} ${prefix}menu ${toSmallCaps('<kategori>')}
│
`;

            availableTags.forEach(tag => {
                menuText += `│  ◦  ${prefix}menu ${tag}\n`;
            });
            
            menuText += `│
└  ${toSmallCaps('*_© Powered by HamzzDev_*')}`;

            return await sock.sendMessage(m.key.remoteJid, {
                text: menuText,
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: myChannel,
                    externalAdReply: {
                        title: toSmallCaps("MIMOSA DASHBOARD"),
                        body: toSmallCaps("Simple. Fast. Secure."),
                        thumbnail: thumbBuffer,
                        thumbnailUrl: thumbBuffer ? undefined : "https://files.catbox.moe/2mq5qq.png",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });
        }

        const selectedTag = args[0].toLowerCase();
        
        if (!tags[selectedTag]) {
            return sock.sendMessage(m.key.remoteJid, { 
                text: `❌ ${toSmallCaps('Kategori')} *${selectedTag}* ${toSmallCaps('tidak ditemukan!')}` 
            }, { quoted: m });
        }

        let detailText = `
┌  📂 ${toSmallCaps(`*${selectedTag.toUpperCase()} MENU*`)}
│
`;

        tags[selectedTag].forEach(cmd => {
            detailText += `│  ◦  ${prefix}${cmd}\n`;
        });

        detailText += `│\n└  ${toSmallCaps('*© Powered by HamzzDev*')}`;

        await sock.sendMessage(m.key.remoteJid, {
            text: detailText,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: myChannel,
                externalAdReply: {
                    title: toSmallCaps(`Category: ${selectedTag.toUpperCase()}`),
                    body: toSmallCaps("Mimosa Bot Assistant"),
                    thumbnail: thumbBuffer,
                    thumbnailUrl: thumbBuffer ? undefined : "https://files.catbox.moe/2mq5qq.png",
                    sourceUrl: "",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    }
};

function formatRuntime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(d % 3600 / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
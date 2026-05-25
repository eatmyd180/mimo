import moment from 'moment-timezone';
import os from 'os';
import fs from 'fs';
import path from 'path';

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;

    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

function ucapan() {
    const time = moment
        .tz('Asia/Jakarta')
        .format('HH');

    if (time >= 4 && time < 10) return 'Ohayou ☀️';
    if (time >= 10 && time < 15) return 'Konnichiwa 🌸';
    if (time >= 15 && time < 18) return 'Otsukaresama 🍂';
    return 'Konbanwa 🌙';
}

export default {
    cmd: ['menu', 'help', 'list'],
    tags: ['general'],

    run: async (sock, m, { user, prefix, pushName, args }) => {

        const videoPath = path.join(process.cwd(), 'src', 'mimosa.mp4');
        let videoBuffer = null;
        try {
            videoBuffer = fs.readFileSync(videoPath);
        } catch {}

        const thumbPath = path.join(process.cwd(), 'src', 'mimosa.png');
        let thumbBuffer = null;
        try {
            thumbBuffer = fs.readFileSync(thumbPath);
        } catch {}

        const command = args[0]?.toLowerCase();

        const level = user?.rpg?.level || 0;
        const premium = user?.premium ? 'Premium ✦' : 'Free User';
        const limit = user?.limit || 0;
        const money = user?.rpg?.money?.toLocaleString() || '0';

        const uptime = clockString(process.uptime() * 1000);
        const platform = os.platform() === 'android' ? 'Android' : 'Linux';
        const date = moment().tz('Asia/Jakarta').format('DD/MM/YYYY');
        const time = moment().tz('Asia/Jakarta').format('HH:mm');

        const categories = {};

        Object.values(global.plugins || {})
            .filter(plugin => plugin && plugin.cmd && plugin.tags && !plugin.ownerOnly)
            .forEach(plugin => {
                const tags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags];
                tags.forEach(tagName => {
                    if (!categories[tagName]) categories[tagName] = [];
                    const commands = Array.isArray(plugin.cmd) ? plugin.cmd : [plugin.cmd];
                    categories[tagName].push(...commands);
                });
            });

        // ALL MENU
        if (command === 'all') {
            let allCommandsText = `
┌〔 𝐀𝐋𝐋 𝐌𝐄𝐍𝐔 ✦ 〕
│
│ こんにちは ${pushName || 'User'}-chan 🌸
│ ${ucapan()}
│ ✦ Total Category : ${Object.keys(categories).length}
│ ✦ Total Command  : ${Object.values(categories).reduce((a, b) => a + b.length, 0)}
│
`;

            for (const cat of Object.keys(categories).sort()) {
                allCommandsText += `
├〔 ${cat.toUpperCase()} 〕
${categories[cat].map(cmd => `│ ⤷ ${prefix}${cmd}`).join('\n')}
│
`;
            }

            allCommandsText += `
└〔 © 𝐇𝐚𝐦𝐳𝐳 𝐃𝐞𝐯 ✦ 〕`;

            await sock.sendMessage(m.key.remoteJid, {
                text: allCommandsText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363369878409989@newsletter',
                        serverMessageId: 101,
                        newsletterName: '✨ Mimosa Multi-Device »'
                    },
                    externalAdReply: {
                        title: 'ALL MENU',
                        body: 'Simple • Fast • Secure',
                        thumbnail: thumbBuffer,
                        sourceUrl: 'https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: global.fkon });
            return;
        }

        // CATEGORY MENU
        const selectedCategory = Object.keys(categories).find(cat => cat.toLowerCase() === command);
        if (selectedCategory) {
            let categoryText = `
┌〔 𝐌𝐄𝐍𝐔 ${selectedCategory.toUpperCase()} ✦ 〕
│
│ いらっしゃいませ 🌸
│
${categories[selectedCategory].map(cmd => `│ ⤷ ${prefix}${cmd}`).join('\n')}
│
├〔 𝐈𝐍𝐅𝐎 〕
│ ⤷ Total Command : ${categories[selectedCategory].length}
│
└〔 © 𝐇𝐚𝐦𝐳𝐳 𝐃𝐞𝐯 ✦ 〕
`;

            await sock.sendMessage(m.key.remoteJid, {
                text: categoryText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363369878409989@newsletter',
                        serverMessageId: 101,
                        newsletterName: '✨ Mimosa Multi-Device »'
                    },
                    externalAdReply: {
                        title: `MENU ${selectedCategory.toUpperCase()}`,
                        body: 'Simple • Fast • Secure',
                        thumbnail: thumbBuffer,
                        sourceUrl: 'https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: global.fkon });
            return;
        }

        // MAIN MENU (default)
        let menuText = `
┌〔 𝐌𝐈𝐌𝐎𝐒𝐀 𝐁𝐎𝐓 ✦ 〕
│
│ こんにちは ${pushName || 'User'}-chan ✨
│ ${ucapan()}
│
├〔 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 〕
│ ⤷ Level    : ${level}
│ ⤷ Money    : Rp ${money}
│ ⤷ Status   : ${premium}
│ ⤷ Limit    : ${limit}
│
├〔 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 〕
│ ⤷ Uptime   : ${uptime}
│ ⤷ Date     : ${date}
│ ⤷ Time     : ${time}
│ ⤷ Platform : ${platform}
│
├〔 𝐋𝐈𝐒𝐓 𝐌𝐄𝐍𝐔 〕
${Object.keys(categories).sort().map(cat => `│ ⤷ ${prefix}menu ${cat}`).join('\n')}
│
├〔 𝐇𝐎𝐖 𝐓𝐎 〕
│ ⤷ ${prefix}menu all
│ ⤷ ${prefix}menu downloader
│ ⤷ ${prefix}menu tools
│
└〔 © 𝐇𝐚𝐦𝐳𝐳 𝐃𝐞𝐯 ✦ 〕
`;

        if (videoBuffer) {
            await sock.sendMessage(m.key.remoteJid, {
                video: videoBuffer,
                mimetype: 'video/mp4',
                gifPlayback: true,
                caption: menuText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363369878409989@newsletter',
                        serverMessageId: 101,
                        newsletterName: '✨ Mimosa Multi-Device »'
                    },
                    externalAdReply: {
                        title: 'MIMOSA BOT',
                        body: 'Simple • Fast • Secure',
                        thumbnail: thumbBuffer,
                        sourceUrl: 'https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: global.fkon });
        } else {
            await sock.sendMessage(m.key.remoteJid, {
                text: menuText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363369878409989@newsletter',
                        serverMessageId: 101,
                        newsletterName: '✨ Mimosa Multi-Device »'
                    },
                    externalAdReply: {
                        title: 'MIMOSA BOT',
                        body: 'Simple • Fast • Secure',
                        thumbnail: thumbBuffer,
                        sourceUrl: 'https://whatsapp.com/channel/0029Vaxfn57Jpe8nkfCU7p27',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: global.fkon });
        }
    }
};
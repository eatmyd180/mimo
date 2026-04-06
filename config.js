import fs from 'fs';
import { watchFile, unwatchFile } from 'fs';
import { fileURLToPath } from 'url';

// --- GLOBAL SETTINGS ---
global.owner = [
    ['6289508242211', 'HamzzDev', true]
];

global.botName = 'Mimosa Multi-Device';
global.botVersion = '7.0';
global.footer = '© Mimosa 2026';
global.packname = 'Sticker By';
global.author = 'Mimosa Bot';

// --- FEATURE TOGGLES ---
global.autodl = true;           // Auto download from social media links
global.antiSpam = true;         // Enable anti-spam system
global.antiLink = true;         // Auto delete group links
global.readMessage = true;      // Auto read messages
global.readGroup = false;       // Auto read group messages (false untuk hemat)
global.publicMode = true;       // Public mode (false = private/owner only)
global.maintenance = false;     // Maintenance mode
global.debug = false;           // Debug mode (show errors)

// --- COOLDOWN SETTINGS ---
global.cooldown = {
    default: 3,         // Default cooldown in seconds
    premium: 1,         // Premium cooldown
    owner: 0            // No cooldown for owner
};

// --- LIMIT SYSTEM ---
global.limit = {
    default: 20,        // Default daily limit
    premium: 100,       // Premium limit
    add: 5,            // Limit added per .buylimit
};

// --- ANTI-SPAM SETTINGS ---
global.antiSpamConfig = {
    maxPerSecond: 5,    // Max messages per second
    warningCount: 3,    // Warnings before ban
};

// --- DOWNLOAD SETTINGS ---
global.downloadConfig = {
    maxSize: 100,       // Max file size in MB
    timeout: 60,        // Download timeout in seconds
};

// --- MEDIA SETTINGS ---
global.mediaConfig = {
    stickerSize: 512,   // Sticker size in pixels
    imageQuality: 80,   // Image quality (1-100)
};

// --- GROUP SETTINGS ---
global.groupConfig = {
    welcome: true,       // Enable welcome message
    leave: true,         // Enable leave message
    promote: true,       // Notify on promote
    demote: true         // Notify on demote
};

// --- NEWSLETTER INFO ---
global.newsletter = {
    jid: '120363204362148135@newsletter',
    name: 'Mimosa Multi-Device✨',
    enabled: true
};

// --- EXTERNAL AD REPLY ---
global.externalAd = {
    title: 'Mimosa Multi-Device',
    body: 'Simple. Fast. Secure.',
    thumbnail: 'https://files.catbox.moe/2mq5qq.png',
    sourceUrl: 'https://whatsapp.com/channel/0029VaFqS8I5Ui2TjO7d9W2L',
    enabled: true
};

// --- WAIT MESSAGES ---
global.wait = ['⏳', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];
global.waitMessage = '⚡ *Mimosa-chan lagi proses...* ⚡\n*Tunggu ya, jangan nakal~* ✨';

// --- ERROR MESSAGES (KAWAII ANIME STYLE) ---
global.errorMessage = '💦 *Ehehe~ Error nih...* 💦\n```%error%```\n*Mimosa-chan minta maaf!* 🥺';
global.ownerOnlyMessage = '👑 *Ehee~ Ini khusus owner saja* 👑\n*Kamu bukan HamzzDev-sama...* 😭\n*Mimosa-chan gabisa kasih akses!* 🚫';
global.groupOnlyMessage = '👥 *UwU~ Ini khusus grup loh* 👥\n*Chat pribadi? Nggak bisa!* ✨\n*Ayo join grup dulu yaa~* 💝';
global.adminOnlyMessage = '👑 *Nyehehe~ Khusus admin grup* 👑\n*Kamu bukan admin...* 😿\n*Mimosa-chan nurut sama admin aja* 🥺';
global.premiumOnlyMessage = '💎 *Waa~ Premium only* 💎\n*Kamu belum premium...* 🌸\n*Upgrade premium dulu yuk!* ✨';
global.botAdminMessage = '🤖 *Mimosa-chan harus jadi admin dulu* 🤖\n*Jadiin admin dulu yaa~* 🥺\n*Plisss...* 🙏';
global.limitMessage = '🌌 *Yah... Limit kamu habis* 🌌\n*Mimosa-chan sedih...* 😢\n*Ketik *.buylimit* dulu ya* 💫';
global.registerMessage = '📝 *Kak, daftar dulu yuk!* 📝\n*Ketik* ```%prefix%register namakamu```\n*Biar Mimosa-chan kenalan sama kamu* 💕';
global.bannedMessage = '🚫 *Duh... Kamu kena banned* 🚫\n*Mimosa-chan kecewa...* 💔\n*Hubungi owner untuk unbanned* 👑';
global.maintenanceMessage = '🔧 *Maintenance mode nih...* 🔧\n*Mimosa-chan lagi diperbaiki* 🛠️\n*Tunggu bentar ya~* ⏳';

// --- COMMAND MESSAGES ---
global.cmdNotFound = '❓ *Eh? Commandnya nggak ada* ❓\n*Ketik* ```%prefix%menu``` *ya* 📋\n*Biar Mimosa-chan kasih tau~* ✨';
global.cmdError = '💥 *Waa error...* 💥\n```%error%```\n*Mimosa-chan nyerah* 😭\n*Lapor owner aja deh* 👑';
global.cmdCooldown = '⏱️ *Sabar dong...* ⏱️\n*Tunggu* ```%time% detik``` *lagi ya* 🥺\n*Jangan ngebut-ngebut* 💦';

// --- SUCCESS MESSAGES ---
global.successMessage = '✅ *Yey! Berhasil~* ✅\n*Mimosa-chan hebat kan?* 🎉\n*Makasih udah pake bot ini* 💕';
global.doneMessage = '🎊 *Sudah selesai!* 🎊\n*Mimosa-chan capek...* 😮‍💨\n*Istirahat dulu yuk* 🌸';

// --- WARNING MESSAGES ---
global.warningMessage = '⚠️ *Peringatan!* ⚠️\n*Kamu sudah warning* ```%count%/3```\n*Jangan nakal yaa...* 😣\n*Mimosa-chan marah loh!* 😤';

// --- RPG EMOTICONS ---
global.rpg = {
    emoticon(string) {
        string = string.toLowerCase();
        let emot = {
            level: '🧬',
            limit: '🌌',
            health: '❤️',
            exp: '✉️',
            money: '💵',
            potion: '🥤',
            diamond: '💎',
            common: '📦',
            uncommon: '🎁',
            mythic: 'mw',
            legendary: '🗃️',
            pet: '🎁',
            trash: '🗑',
            armor: '🥼',
            sword: '⚔️',
            pickaxe: '⛏️',
            fishingrod: '🎣',
            wood: '🪵',
            rock: '🪨',
            string: '🕸️',
            horse: '🐎',
            cat: '🐈',
            dog: '🐕',
            fox: '🦊',
            petFood: '🍖',
            iron: '⛓️',
            gold: '👑',
            emerald: '💚'
        };
        let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string));
        if (!results.length) return '';
        else return emot[results[0][0]];
    }
};

// --- CHARACTER INFO ---
global.character = {
    name: 'Mimosa-chan',
    age: '16 (永远)',
    birthday: '24 Desember',
    personality: 'Genki, tsundere, sometimes dere-dere',
    likes: ['🍡 Dango', '🍵 Matcha', '🐱 Neko', '✨ Sparkles'],
    dislikes: ['😠 Spammer', '🚫 Toxic people', '💢 Error'],
    catchphrase: 'Mimosa-chan, majuu~! ✨'
};

// --- KAWAII EMOJIS ---
global.kawaii = {
    happy: ['✨', '🎉', '🎊', '💕', '🌸', '🌟', '⭐', '💫'],
    sad: ['😢', '😭', '🥺', '💔', '😿', '💦', '🌧️'],
    angry: ['😤', '💢', '😠', '👿', '🔥', '💥'],
    love: ['💕', '💗', '💓', '💖', '💘', '💝', '❤️', '🧡', '💛', '💚', '💙', '💜'],
    cute: ['🥺', '👉👈', 'uwu', 'owo', 'ehehe', 'nyaa~']
};

// --- LOGGING ---
global.logging = {
    commands: true,      // Log commands
    errors: true,        // Log errors
    joins: true,         // Log group joins
    leaves: true         // Log group leaves
};

// --- TIMEZONE ---
global.timezone = 'Asia/Jakarta';

// --- LANGUAGE ---
global.language = 'id';

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
    unwatchFile(file);
    console.log('🔄 *Mimosa-chan update config!* 🔄');
    import(file + '?update=' + Date.now());
});
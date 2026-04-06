import 'dotenv/config';
import './config.js';

import { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    Browsers, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidNormalizedUser
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CUSTOM MODULES ---
import connectDB from './src/database/mongo.js';
import { handler } from './src/handler.js';
import groupHandler from './src/handlers/group.js';
import { loadPlugins, watchPlugins } from './src/lib/loader.js';

// --- CONFIG ---
const USE_PAIRING_CODE = true;
const MONGO_URI = process.env.MONGO_URI;
const BOT_NUMBER = process.env.BOT_NUMBER || '6283197076617'; // Hardcode nomor mu
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_FOLDER = path.join(__dirname, 'src/plugins');

// Logger level fatal agar terminal bersih
const logger = pino({ level: 'fatal' });

async function startBot() {
    console.clear();
    console.log(chalk.cyan.bold('🚀 MEMULAI MIMOSA V7 (LIGHTWEIGHT MODE)...'));
    console.log(chalk.yellow(`📱 Bot Number: ${BOT_NUMBER}`));

    // 1. Database
    if (!MONGO_URI) {
        console.error(chalk.bgRed.white(' FATAL '), 'MONGO_URI is missing in .env');
        process.exit(1);
    }
    await connectDB(MONGO_URI);

    // 2. Plugins
    console.log(chalk.blue('📂 Memuat Plugins...'));
    await loadPlugins(PLUGIN_FOLDER);
    watchPlugins(PLUGIN_FOLDER);

    // 3. Auth
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(chalk.yellow(`📱 WA v${version.join('.')} (Latest: ${isLatest})`));

    // 4. Socket
    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false, // Matikan QR, pakai pairing code
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: false,
        syncFullHistory: false
    });

    // 5. Connection Handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red('Sesi Logged Out. Hapus folder sessions.'));
                process.exit(0);
            } else {
                console.log(chalk.yellow('🔄 Koneksi terputus, restarting...'));
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green.bold('\n✅ BOT ONLINE!'));
            console.log(chalk.cyan(`User: ${sock.user.id.split(':')[0]}`));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // 6. PAIRING CODE - OTOMATIS LANGSUNG REQUEST
    if (USE_PAIRING_CODE && !state.creds.registered) {
        console.log(chalk.yellow.bold('⚠️  Meminta kode pairing...'));
        
        // Fungsi untuk request pairing code dengan retry
        const requestPairingWithRetry = async (retries = 5) => {
            for (let i = 0; i < retries; i++) {
                try {
                    console.log(chalk.blue(`📱 Mencoba request kode untuk ${BOT_NUMBER} (percobaan ${i + 1}/${retries})...`));
                    
                    // Tunggu socket benar-benar siap
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    const code = await sock.requestPairingCode(BOT_NUMBER);
                    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
                    
                    console.log(chalk.black.bgGreen(`\n🔐 KODE PAIRING: ${formattedCode} 🔐\n`));
                    console.log(chalk.cyan('📱 Cara menggunakan:'));
                    console.log(chalk.white('   1. Buka WhatsApp di nomor ' + BOT_NUMBER));
                    console.log(chalk.white('   2. Pengaturan → Perangkat Tertaut'));
                    console.log(chalk.white('   3. Tautkan Perangkat → Tautkan dengan kode pairing'));
                    console.log(chalk.white('   4. Masukkan kode: ' + formattedCode + '\n'));
                    
                    return true;
                } catch (err) {
                    console.log(chalk.red(`❌ Gagal: ${err.message}`));
                    if (i < retries - 1) {
                        console.log(chalk.blue(`⏳ Menunggu 5 detik sebelum mencoba lagi...`));
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
            }
            console.log(chalk.red.bold('❌ Gagal mendapatkan kode pairing setelah beberapa percobaan!'));
            console.log(chalk.yellow('💡 Pastikan nomor ' + BOT_NUMBER + ' terdaftar di WhatsApp dan koneksi internet stabil'));
            return false;
        };

        // Jalankan request pairing
        await requestPairingWithRetry(5);
    }

    // 7. Message Handler
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (!chatUpdate.messages) return;
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            
            await handler(sock, m, chatUpdate);
        } catch (err) {
            console.error(chalk.red('Handler Error:'), err);
        }
    });

    // 8. Group Handler
    sock.ev.on('group-participants.update', async (update) => {
        await groupHandler(sock, update);
    });
}

startBot().catch(err => console.error(chalk.red('System Error:'), err));

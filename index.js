import 'dotenv/config';
import './config.js';

import { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    Browsers, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore, // Fitur Wajib Baileys Terbaru
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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_FOLDER = path.join(__dirname, 'src/plugins');

// Logger level fatal agar terminal bersih
const logger = pino({ level: 'fatal' });

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, (ans) => { rl.close(); resolve(ans); }));
};

async function startBot() {
    console.clear();
    console.log(chalk.cyan.bold('🚀 MEMULAI MIMOSA V7 (LIGHTWEIGHT MODE)...'));

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
        printQRInTerminal: !USE_PAIRING_CODE,
        auth: {
            creds: state.creds,
            // Cacheable Key Store untuk stabilitas sesi (Anti Decryption Error)
            keys: makeCacheableSignalKeyStore(state.keys, logger), 
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: false,
        syncFullHistory: false // Matikan sync agar ringan
    });

    // 5. Pairing Code
    if (USE_PAIRING_CODE && !sock.authState.creds.registered) {
        console.log(chalk.yellow.bold('⚠️  Pairing Process...'));
        let phoneNumber = process.env.BOT_NUMBER;
        if (!phoneNumber) {
            phoneNumber = await question(chalk.bgMagenta.white(' Masukkan Nomor Bot (62xxx): ') + ' ');
        }
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(chalk.black.bgGreen(` KODE PAIRING: `));
                console.log(chalk.black.bgWhite(` ${code?.match(/.{1,4}/g)?.join('-') || code} `));
            } catch (err) {
                console.error('Gagal request code:', err);
            }
        }, 3000);
    }

    // 6. Connection Handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red('Sesi Logged Out. Hapus folder sessions.'));
                process.exit(0);
            } else {
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green.bold('\n✅ BOT ONLINE!'));
            console.log(chalk.cyan(`User: ${sock.user.id.split(':')[0]}`));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // 7. Message Handler
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (!chatUpdate.messages) return;
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            
            // Langsung panggil handler tanpa store
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

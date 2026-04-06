import { Group } from '../database/schema.js';
import chalk from 'chalk';

const groupHandler = async (sock, update) => {
    try {
        const { id, participants, action } = update;

        // 1. Cek Database: Apakah Welcome Aktif di grup ini?
        const groupData = await Group.findOne({ id: id });
        
        // Jika data grup tidak ada atau fitur welcome dimatikan, STOP.
        if (!groupData || !groupData.welcome) return;

        // 2. Dapatkan Metadata Grup (Nama & Deskripsi)
        let metadata;
        try {
            metadata = await sock.groupMetadata(id);
        } catch (e) {
            return; 
        }

        const groupName = metadata.subject;
        const groupDesc = metadata.desc || 'Tidak ada deskripsi.';

        // 3. Loop untuk setiap participant (karena bisa banyak yang masuk sekaligus)
        for (const num of participants) {
            // Ambil Foto Profil User
            let ppUser;
            try {
                ppUser = await sock.profilePictureUrl(num, 'image');
            } catch {
                ppUser = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'; // Default
            }

            // --- WELCOME (Member Masuk) ---
            if (action === 'add') {
                const textWelcome = `
Halo @${num.split('@')[0]} 👋
Selamat datang di *${groupName}*!

📜 *Deskripsi Grup:*
${groupDesc}

Semoga betah ya!
`;
                await sock.sendMessage(id, { 
                    text: textWelcome, 
                    contextInfo: { 
                        mentionedJid: [num],
                        externalAdReply: {
                            title: `Welcome to ${groupName}`,
                            body: 'Mimosa Bot System',
                            thumbnailUrl: ppUser,
                            sourceUrl: '',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    } 
                });
            }

            // --- GOODBYE (Member Keluar) ---
            else if (action === 'remove') {
                const textGoodbye = `Selamat tinggal @${num.split('@')[0]} 👋\nJangan lupa main lagi ya.`;
                
                await sock.sendMessage(id, {
                    text: textGoodbye,
                    contextInfo: { mentionedJid: [num] }
                });
            }
        }
    } catch (err) {
        console.error(chalk.red('Group Handler Error:'), err);
    }
};

export default groupHandler;

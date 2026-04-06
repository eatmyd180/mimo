export default {
    cmd: ['hidetag', 'ht', 'tagall'],
    tags: ['group'],
    groupOnly: true,
    adminOnly: true,

    run: async (sock, m, { text, participants }) => {
        // Ambil ID semua member
        const users = participants.map(u => u.id);
        
        // Pesan yang akan dikirim (default jika teks kosong)
        const msgText = text || '📢 Perhatian Semuanya!';

        // Kirim pesan dengan mentions array berisi semua member
        await sock.sendMessage(m.key.remoteJid, { 
            text: msgText, 
            mentions: users 
        }, { quoted: m });
    }
};

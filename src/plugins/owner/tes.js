// plugins/debug/jimp-test.js (buat file ini sementara)
export default {
    cmd: ['testjimp'],
    tags: ['owner'],
    ownerOnly: true,
    run: async (sock, m) => {
        try {
            const jimp = await import('jimp');
            const result = {
                default: jimp.default ? 'ADA' : 'TIDAK ADA',
                read: typeof jimp.read === 'function' ? 'function' : typeof jimp.read,
                keys: Object.keys(jimp)
            };
            await m.reply(JSON.stringify(result, null, 2));
        } catch (e) {
            await m.reply('Error: ' + e.message);
        }
    }
};
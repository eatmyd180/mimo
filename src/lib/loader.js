import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // Tambahkan pathToFileURL
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginFolder = path.join(__dirname, '../plugins');

global.plugins = {};

/**
 * Fungsi untuk memuat ulang plugin secara otomatis (Hot Reload)
 */
const loadPlugins = async (folder) => {
    // Pastikan folder ada
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const files = fs.readdirSync(folder, { recursive: true });

    for (const file of files) {
        const fullPath = path.join(folder, file);
        
        // Hanya baca file .js dan abaikan folder
        if (fs.statSync(fullPath).isDirectory() || !file.endsWith('.js')) continue;

        try {
            // FIX: Gunakan pathToFileURL agar bisa ditambah query string timestamp
            // Ini mencegah cache sehingga auto-reload bekerja
            const fileUrl = pathToFileURL(fullPath).href;
            const module = await import(fileUrl + '?update=' + Date.now());
            
            // Simpan ke global variable
            // Gunakan path relative sebagai key agar konsisten (misal: 'tools/ping.js')
            const relativePath = path.relative(folder, fullPath); 
            
            if (module.default) {
                global.plugins[relativePath] = module.default;
            }
        } catch (e) {
            console.error(chalk.red(`Error loading plugin ${file}:`), e);
        }
    }
    console.log(chalk.green(`✅ Berhasil memuat ${Object.keys(global.plugins).length} Plugins`));
};

// Watcher: Mendeteksi perubahan file
const watchPlugins = (folder) => {
    fs.watch(folder, { recursive: true }, async (eventType, filename) => {
        if (!filename || !filename.endsWith('.js')) return;
        
        const fullPath = path.join(folder, filename);
        const relativePath = filename; // fs.watch biasanya return relative filename

        console.log(chalk.yellow(`🔄 Plugin Updated: ${filename}`));

        try {
            if (fs.existsSync(fullPath)) {
                // FIX: Gunakan pathToFileURL di sini juga
                const fileUrl = pathToFileURL(fullPath).href;
                const module = await import(fileUrl + '?update=' + Date.now());
                
                global.plugins[relativePath] = module.default;
                console.log(chalk.green(`✅ Plugin Reloaded: ${filename}`));
            } else {
                delete global.plugins[relativePath];
                console.log(chalk.red(`🗑️ Plugin Deleted: ${filename}`));
            }
        } catch (e) {
            console.error(chalk.red(`Gagal reload plugin:`), e);
        }
    });
};

export { loadPlugins, watchPlugins, pluginFolder };

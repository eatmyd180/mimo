import chalk from 'chalk'
import { User, Group } from './database/schema.js'
import { jidNormalizedUser, downloadContentFromMessage, getContentType, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import { fileTypeFromBuffer } from 'file-type'
import axios from 'axios'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const findValidJid = (obj) => {
    if (!obj) return null
    for (let key in obj) {
        if (typeof obj[key] === 'string' && obj[key].endsWith('@s.whatsapp.net')) {
            return obj[key]
        }
    }
    return null
}

const parseMentions = (text) => {
    let matches = text?.match(/@(\d{10,15})/g) || []
    return matches.map(match => match.replace('@', '') + '@s.whatsapp.net')
}

const spamTracker = new Map()

export const handler = async (sock, m, chatUpdate, store = {}) => {
    try {
        const rawSender = m.key.fromMe
            ? sock.user.id
            : (findValidJid(m.key) || m.key.participant || m.key.remoteJid)

        const sender = jidNormalizedUser(rawSender)
        const senderNumber = sender.split('@')[0]

        const botId = jidNormalizedUser(sock.user.id)
        const botNumber = botId.split('@')[0]

        const isGroup = m.key.remoteJid.endsWith('@g.us')
        if (m.key.remoteJid === 'status@broadcast') return

        m.mtype = getContentType(m.message)
        m.msg = m.mtype === 'viewOnceMessage' 
            ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
            : m.message[m.mtype]

        const body = m.message?.conversation ||
                    m.msg?.caption ||
                    m.msg?.text ||
                    ''

        const isCmd = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
        const prefix = isCmd ? body[0] : ''
        const command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1)
        const text = args.join(' ')
        const pushName = m.pushName || 'User'

        m.mentionedJid = m.msg?.contextInfo?.mentionedJid || []

        m.react = async (emoji) => {
            try {
                await sock.sendMessage(m.key.remoteJid, {
                    react: { text: emoji, key: m.key }
                })
            } catch (error) {
                console.error('React Error:', error)
            }
        }

        m.reply = async (content, options = {}) => {
            try {
                if (typeof content === 'string') {
                    return sock.sendMessage(m.key.remoteJid, {
                        text: content,
                        mentions: parseMentions(content),
                        contextInfo: {
                            forwardingScore: options.forward ? 999 : 0,
                            isForwarded: options.forward || false,
                            externalAdReply: options.externalAdReply || (global.externalAd?.enabled ? {
                                title: global.externalAd.title || global.botName,
                                body: global.externalAd.body || global.footer,
                                thumbnailUrl: global.externalAd.thumbnail,
                                sourceUrl: global.externalAd.sourceUrl,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            } : undefined)
                        },
                        ...options
                    }, { quoted: m })
                } else if (Buffer.isBuffer(content)) {
                    const type = await fileTypeFromBuffer(content)
                    if (type?.mime?.startsWith('image/')) {
                        return sock.sendMessage(m.key.remoteJid, {
                            image: content,
                            caption: options.caption || '',
                            ...options
                        }, { quoted: m })
                    } else if (type?.mime?.startsWith('video/')) {
                        return sock.sendMessage(m.key.remoteJid, {
                            video: content,
                            caption: options.caption || '',
                            ...options
                        }, { quoted: m })
                    } else {
                        return sock.sendMessage(m.key.remoteJid, {
                            document: content,
                            mimetype: type?.mime || 'application/octet-stream',
                            fileName: options.filename || `file.${type?.ext || 'bin'}`,
                            caption: options.caption || '',
                            ...options
                        }, { quoted: m })
                    }
                } else if (typeof content === 'object') {
                    return sock.sendMessage(m.key.remoteJid, content, { quoted: m, ...options })
                }
            } catch (e) {
                console.error('Reply Error:', e)
                return sock.sendMessage(m.key.remoteJid, { text: 'Error: ' + e.message }, { quoted: m })
            }
        }

        // ==================== PERBAIKAN QUOTED MESSAGE DENGAN TEXT ====================
        if (m.msg?.contextInfo?.quotedMessage) {
            const quotedMessage = m.msg.contextInfo.quotedMessage
            const quotedType = getContentType(quotedMessage)
            const quotedContent = quotedMessage[quotedType]
            
            const quotedSender = jidNormalizedUser(m.msg.contextInfo.participant || m.key.participant || m.key.remoteJid)
            const quotedId = m.msg.contextInfo.stanzaId
            const quotedChat = m.msg.contextInfo.remoteJid || m.key.remoteJid
            
            // Ambil text dari berbagai kemungkinan
            let quotedText = '';
            
            if (quotedType === 'conversation') {
                quotedText = quotedContent || '';
            } else if (quotedType === 'extendedTextMessage') {
                quotedText = quotedContent?.text || '';
            } else if (quotedType === 'imageMessage') {
                quotedText = quotedContent?.caption || '';
            } else if (quotedType === 'videoMessage') {
                quotedText = quotedContent?.caption || '';
            } else if (quotedType === 'documentMessage') {
                quotedText = quotedContent?.caption || '';
            } else {
                quotedText = quotedContent?.text || quotedContent?.caption || quotedContent?.description || '';
            }
            
            m.quoted = {
                id: quotedId,
                chat: quotedChat,
                sender: quotedSender,
                fromMe: quotedSender === jidNormalizedUser(sock.user.id),
                type: quotedType,
                mtype: quotedType,
                text: quotedText,
                message: quotedMessage,
                mentionedJid: quotedContent?.contextInfo?.mentionedJid || [],
                
                key: {
                    remoteJid: quotedChat,
                    fromMe: quotedSender === jidNormalizedUser(sock.user.id),
                    id: quotedId,
                    participant: quotedSender
                },
                
                download: async (filename = null) => {
                    try {
                        const mediaType = quotedType.replace('Message', '')
                        const stream = await downloadContentFromMessage(quotedContent, mediaType)
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        
                        if (filename) {
                            const type = await fileTypeFromBuffer(buffer)
                            const filePath = path.join(process.cwd(), filename + '.' + (type?.ext || 'bin'))
                            fs.writeFileSync(filePath, buffer)
                            return filePath
                        }
                        return buffer
                    } catch (e) {
                        console.error('Quoted Download Error:', e)
                        throw e
                    }
                },
                
                delete: () => {
                    const vM = proto.WebMessageInfo.fromObject({
                        key: {
                            remoteJid: quotedChat,
                            fromMe: quotedSender === jidNormalizedUser(sock.user.id),
                            id: quotedId
                        }
                    })
                    return sock.sendMessage(quotedChat, { delete: vM.key })
                },
                
                reply: async (content, options = {}) => {
                    return sock.sendMessage(quotedChat, {
                        text: content,
                        ...options
                    }, { quoted: m.quoted })
                }
            }
            
            if (quotedType === 'imageMessage' || quotedType === 'videoMessage' || quotedType === 'audioMessage' || quotedType === 'stickerMessage') {
                m.quoted.media = quotedContent
            }
        } else {
            m.quoted = null
        }

        const ownerConfig = global.owner
            .map(v => (Array.isArray(v) ? v[0] : v))
            .map(v => v.replace(/[^0-9]/g, ''))

        const isOwner = m.key.fromMe || ownerConfig.includes(senderNumber)

        let user = await User.findOne({ phoneNumber: sender })
        if (!user) {
            user = new User({
                phoneNumber: sender,
                name: pushName,
                limit: global.limit?.default || 20,
                premium: isOwner,
                registered: false,
                premiumTime: 0,
                banned: false,
                warning: 0
            })
            await user.save()
        }

        if (user.banned) {
            if (isCmd) await m.reply('🚫 Kamu telah dibanned!')
            return
        }

        if (user.premium && user.premiumTime !== 0 && Date.now() > user.premiumTime) {
            user.premium = false
            user.premiumTime = 0
            await user.save()
            await m.reply('🔔 Masa Premium kamu telah berakhir.')
        }

        if (global.maintenance && !isOwner) {
            if (isCmd) await m.reply('🔧 Maintenance mode')
            return
        }

        if (global.antiSpam && !isOwner && !user.premium) {
            const now = Date.now()
            const userSpam = spamTracker.get(sender) || { count: 0, lastMsg: 0 }
            
            if (now - userSpam.lastMsg < 1000) {
                userSpam.count++
                if (userSpam.count > (global.antiSpamConfig?.maxPerSecond || 5)) {
                    user.warning++
                    await user.save()
                    
                    if (user.warning >= (global.antiSpamConfig?.warningCount || 3)) {
                        user.banned = true
                        await user.save()
                        await m.reply('🚫 Kamu telah dibanned karena spam!')
                        return
                    } else {
                        await m.reply(`⚠️ Warning ${user.warning}/3: Jangan spam!`)
                    }
                }
            } else {
                userSpam.count = 1
            }
            
            userSpam.lastMsg = now
            spamTracker.set(sender, userSpam)
        }

        // ==================== EVAL COMMAND ====================
        if (isOwner) {
            const firstChar = body.charAt(0);
            const isEvalCommand = firstChar === '>' || firstChar === '$';
            const isAsyncEval = body.startsWith('>>');
            
            if (isEvalCommand || isAsyncEval) {
                try {
                    let evalCommand = isAsyncEval ? '>>' : firstChar;
                    let evalCode = isAsyncEval ? body.substring(2).trim() : body.substring(1).trim();
                    
                    if (!evalCode && evalCommand !== '>') {
                        return m.reply(`*Cara penggunaan:*\n${evalCommand} <kode>`);
                    }
                    
                    await m.react('⏳');
                    
                    const util = await import('util');
                    const { exec } = await import('child_process');
                    
                    if (evalCommand === '>' || evalCommand === '>>') {
                        let result;
                        
                        const context = {
                            sock, m, util: util.default,
                            sender, senderNumber, botNumber, isGroup, pushName,
                            $user: user,
                            fs, path
                        };
                        
                        const contextKeys = Object.keys(context);
                        const contextValues = Object.values(context);
                        
                        if (evalCommand === '>>') {
                            const asyncFn = new Function(...contextKeys, `
                                return (async () => {
                                    try {
                                        return ${evalCode}
                                    } catch (e) {
                                        return e;
                                    }
                                })()
                            `);
                            result = await asyncFn(...contextValues);
                        } else {
                            const syncFn = new Function(...contextKeys, `
                                try {
                                    return ${evalCode}
                                } catch (e) {
                                    return e;
                                }
                            `);
                            result = syncFn(...contextValues);
                        }
                        
                        const output = util.default.inspect(result, { 
                            depth: 3, 
                            colors: false,
                            maxArrayLength: 50
                        });
                        
                        await m.react('✅');
                        
                        if (output.length > 4000) {
                            await sock.sendMessage(m.key.remoteJid, {
                                document: Buffer.from(output, 'utf-8'),
                                mimetype: 'text/plain',
                                fileName: 'eval_result.txt',
                                caption: '📎 Hasil terlalu panjang'
                            }, { quoted: m });
                        } else {
                            await m.reply(`📦 *Output:*\n\`\`\`${output}\`\`\``);
                        }
                    }
                    
                    else if (evalCommand === '$') {
                        exec(evalCode, {
                            timeout: 15000,
                            maxBuffer: 1024 * 2000,
                            shell: true
                        }, async (error, stdout, stderr) => {
                            let output = '';
                            
                            if (error) output += `❌ *Error:* ${error.message}\n`;
                            if (stderr) output += `⚠️ *Stderr:*\n${stderr}\n`;
                            if (stdout) output += `✅ *Stdout:*\n${stdout}`;
                            if (!output) output = '✅ Command executed (no output)';
                            
                            await m.react('✅');
                            
                            if (output.length > 4000) {
                                await sock.sendMessage(m.key.remoteJid, {
                                    document: Buffer.from(output, 'utf-8'),
                                    mimetype: 'text/plain',
                                    fileName: 'exec_output.txt'
                                }, { quoted: m });
                            } else {
                                await m.reply(`💻 *Result:*\n\`\`\`${output}\`\`\``);
                            }
                        });
                    }
                    
                    return;
                } catch (error) {
                    console.error('Eval Error:', error);
                    await m.react('❌');
                    await m.reply(`❌ *Error:*\n\`\`\`${error.message}\`\`\``);
                    return;
                }
            }
        }

        const beforePlugins = Object.values(global.plugins)
            .filter(p => typeof p?.before === 'function')
            .sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10))

        for (let plugin of beforePlugins) {
            try {
                const stop = await plugin.before(sock, m, {
                    body,
                    isCmd,
                    command,
                    prefix,
                    args,
                    text,
                    user,
                    isGroup,
                    sender,
                    senderNumber,
                    botNumber,
                    isOwner,
                    pushName,
                    store
                })

                if (stop) return
            } catch (e) {
                console.error(chalk.bgRed.white('[BEFORE ERROR]'), plugin.cmd || plugin.name || 'unknown', e)
            }
        }

        if (isCmd && global.logging?.commands) {
            console.log(chalk.bgMagenta.white('[CMD]'), chalk.green(command))
            console.log(chalk.cyan(`   ├─ Sender : ${sender}`))
            console.log(chalk.cyan(`   ├─ Group  : ${isGroup ? 'Yes' : 'No'}`))
            console.log(chalk.cyan(`   └─ IsOwner: ${isOwner}`))
        }

        // ==================== PLUGIN RUNNER ====================
        if (isCmd && command) {
            let executed = false;
            
            for (let plugin of Object.values(global.plugins)) {
                if (!plugin || !plugin.cmd) continue

                const isMatch = Array.isArray(plugin.cmd)
                    ? plugin.cmd.includes(command)
                    : plugin.cmd === command;

                if (!isMatch) continue;
                if (executed) break;
                
                let isAdmin = false
                let isBotAdmin = false
                let groupMetadata = null

                if (isGroup) {
                    groupMetadata = await sock.groupMetadata(m.key.remoteJid)
                    const admins = groupMetadata.participants
                        .filter(p => p.admin)
                        .map(p => jidNormalizedUser(p.id).split('@')[0])

                    isAdmin = admins.includes(senderNumber)
                    isBotAdmin = admins.includes(botNumber)
                }

                if (plugin.hidden && !isOwner) {
                    await m.reply('🚧 Fitur dalam perbaikan')
                    executed = true;
                    break;
                }
                if (plugin.ownerOnly && !isOwner) {
                    await m.reply('❌ Khusus Owner!')
                    executed = true;
                    break;
                }
                if (plugin.groupOnly && !isGroup) {
                    await m.reply('❌ Khusus Grup!')
                    executed = true;
                    break;
                }
                if (plugin.adminOnly && !isAdmin && !isOwner) {
                    await m.reply('❌ Khusus Admin!')
                    executed = true;
                    break;
                }
                if (plugin.botAdmin && !isBotAdmin) {
                    await m.reply('❌ Bot harus jadi Admin!')
                    executed = true;
                    break;
                }
                if (plugin.register && !user.registered) {
                    await m.reply(`❌ Kamu belum terdaftar! Ketik *${prefix}register nama*`)
                    executed = true;
                    break;
                }
                if (plugin.premium && !isOwner && !user.premium) {
                    await m.reply('❌ Khusus Premium!')
                    executed = true;
                    break;
                }
                if (plugin.limit && !isOwner && !user.premium) {
                    if (user.limit < 1) {
                        await m.reply('❌ Limit habis!')
                        executed = true;
                        break;
                    }
                    user.limit -= 1
                    await user.save()
                }

                try {
                    const start = Date.now()
                    await plugin.run(sock, m, {
                        text,
                        args,
                        command,
                        prefix,
                        user,
                        isGroup,
                        isAdmin,
                        isBotAdmin,
                        isOwner,
                        sender,
                        senderNumber,
                        pushName,
                        groupMetadata,
                        store
                    })
                    
                    executed = true;
                    break;
                    
                } catch (e) {
                    console.error(`[PLUGIN ERROR] ${command}:`, e)
                    await sock.sendMessage(m.key.remoteJid, { text: `❌ Error: ${e.message}` }, { quoted: m })
                    executed = true;
                    break;
                }
            }
            
            if (!executed && isCmd) {
                await m.reply(`❌ Command "${command}" tidak ditemukan! Ketik .menu`)
            }
        }

    } catch (err) {
        console.error('Handler Error:', err)
    }
}

const __filename = new URL(import.meta.url).pathname
fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename)
    console.log(chalk.redBright(`🔄 ${__filename} updated, reloading...`))
    import(`${__filename}?update=${Date.now()}`)
})
import mongoose from 'mongoose';

// --- USER SCHEMA (YANG LAMA) ---
const UserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String },
    language: { type: String, default: 'id', enum: ['id', 'en'] },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'developer'] },
    limit: { type: Number, default: 20 },
    premium: { type: Boolean, default: false },
    premiumTime: { type: Number, default: 0 },
    rpg: {
        level: { type: Number, default: 1 },
        exp: { type: Number, default: 0 },
        money: { type: Number, default: 1000 },
        inventory: { type: Array, default: [] }
    },
    createdAt: { type: Date, default: Date.now }
});

// --- GROUP SCHEMA (BARU) ---
const GroupSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // ID Grup (jid)
    welcome: { type: Boolean, default: false },        // Status Welcome
    antilink: { type: Boolean, default: false },       // Status Antilink
    mute: { type: Boolean, default: false }            // Status Mute (Bot diam)
});

export const User = mongoose.model('User', UserSchema);
export const Group = mongoose.model('Group', GroupSchema);

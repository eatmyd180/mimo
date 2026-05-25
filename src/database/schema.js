import mongoose from 'mongoose'

// ==================== USER SCHEMA ====================
const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },

    // REGISTER
    name: {
        type: String,
        default: ''
    },

    age: {
        type: Number,
        default: 0
    },

    registered: {
        type: Boolean,
        default: false
    },

    serial: {
        type: String,
        default: ''
    },

    regTime: {
        type: Number,
        default: 0
    },

    // SETTINGS
    language: {
        type: String,
        default: 'id',
        enum: ['id', 'en']
    },

    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'developer']
    },

    // LIMIT & PREMIUM
    limit: {
        type: Number,
        default: 20
    },

    premium: {
        type: Boolean,
        default: false
    },

    premiumTime: {
        type: Number,
        default: 0
    },

    // MODERATION
    banned: {
        type: Boolean,
        default: false
    },

    warning: {
        type: Number,
        default: 0
    },

    // RPG
    rpg: {
        level: {
            type: Number,
            default: 1
        },

        exp: {
            type: Number,
            default: 0
        },

        money: {
            type: Number,
            default: 1000
        },

        inventory: {
            type: Array,
            default: []
        }
    },

    // CREATED
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// ==================== GROUP SCHEMA ====================
const GroupSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },

    welcome: {
        type: Boolean,
        default: false
    },

    antilink: {
        type: Boolean,
        default: false
    },

    mute: {
        type: Boolean,
        default: false
    }
})

// ==================== EXPORT ====================
export const User = mongoose.model('User', UserSchema)

export const Group = mongoose.model('Group', GroupSchema)
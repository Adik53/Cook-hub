const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Введите имя пользователя'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Введите email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Введите корректный email']
    },
    password: {
        type: String,
        required: [true, 'Введите пароль'],
        minlength: 6,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeExpires: {
        type: Date,
        select: false
    },
    bio: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        min: 13,
        max: 120
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // ← ДОБАВЬ return!
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateVerificationCode = function() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCode = code;
    this.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 минут
    return code;
};

const User = mongoose.model('User', mongoose.models.User || userSchema);

module.exports = User;
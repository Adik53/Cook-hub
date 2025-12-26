    const express = require('express');
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const { protect } = require('../middleware/auth');
    const { sendVerificationEmail } = require('../config/email');

    const router = express.Router();

    // Генерация JWT
    const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });
    };

    // ========== DEBUG ENDPOINTS (УДАЛИТЬ В ПРОДАКШЕНЕ!) ==========

    // @route GET /api/auth/debug/all-users
    router.get('/debug/all-users', async (req, res) => {
        try {
            const users = await User.find({}).select('username email createdAt isVerified');
            res.json({
                count: users.length,
                users: users
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // @route DELETE /api/auth/debug/delete-user/:email
    router.delete('/debug/delete-user/:email', async (req, res) => {
        try {
            const email = req.params.email.toLowerCase();
            const result = await User.deleteOne({ email });

            if (result.deletedCount > 0) {
                res.json({ message: `Пользователь с email ${email} удалён`, deleted: true });
            } else {
                res.json({ message: `Пользователь с email ${email} не найден`, deleted: false });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // @route DELETE /api/auth/debug/clear-all
    router.delete('/debug/clear-all', async (req, res) => {
        try {
            const result = await User.deleteMany({});
            res.json({
                message: `Удалено ${result.deletedCount} пользователей`,
                deletedCount: result.deletedCount
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // @route POST /api/auth/debug/verify-user/:email
    // Временно верифицировать пользователя без кода
    router.post('/debug/verify-user/:email', async (req, res) => {
        try {
            const email = req.params.email.toLowerCase();
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.isVerified = true;
            await user.save();

            res.json({
                message: `Пользователь ${email} верифицирован!`,
                token: generateToken(user._id)
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // ========== ОСНОВНЫЕ ENDPOINTS ==========

    // @route POST /api/auth/register
    router.post('/register', async (req, res) => {
        try {
            const { username, email, password } = req.body;

            console.log('=== РЕГИСТРАЦИЯ ===');
            console.log('Username:', username);
            console.log('Email:', email);

            // Проверка существования
            const existingUser = await User.findOne({
                $or: [{ email: email.toLowerCase() }, { username }]
            });

            if (existingUser) {
                if (existingUser.email === email.toLowerCase()) {
                    return res.status(400).json({ message: 'Email уже используется' });
                }
                if (existingUser.username === username) {
                    return res.status(400).json({ message: 'Username уже занят' });
                }
            }

            // Создание пользователя
            const user = await User.create({
                username,
                email: email.toLowerCase(),
                password,
                isVerified: false // Требуем верификацию в продакшене
            });

            console.log('Пользователь создан:', user._id);

            // Генерация кода верификации
            const code = user.generateVerificationCode();
            await user.save();

            console.log('🔑 КОД ВЕРИФИКАЦИИ:', code);

            // Отправка email с кодом
            try {
                await sendVerificationEmail(user.email, code, user.username);
                res.status(201).json({
                    message: 'Check your email for verification code',
                    email: user.email,
                    needsVerification: true
                });
            } catch (emailError) {
                console.error('❌ Email send error:', emailError);
                // Fallback: показываем код если email не отправился
                res.status(201).json({
                    message: 'Email error. Your code: ' + code,
                    email: user.email,
                    needsVerification: true,
                    devCode: code // Показываем код только при ошибке
                });
            }

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            res.status(500).json({ message: error.message });
        }
    });

    // @route POST /api/auth/resend-code
    router.post('/resend-code', async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email: email.toLowerCase() }).select('+verificationCode +verificationCodeExpires');

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            if (user.isVerified) {
                return res.status(400).json({ message: 'Email уже подтверждён' });
            }

            // Генерация нового кода
            const code = user.generateVerificationCode();
            await user.save();

            console.log('🔑 NEW CODE for', email, ':', code);

            try {
                const user = await User.findOne({ email: email.toLowerCase() });
                await sendVerificationEmail(user.email, code, user.username);
                res.json({
                    message: 'New code sent to email'
                });
            } catch (emailError) {
                console.error('❌ Email send error:', emailError);
                res.json({
                    message: 'Email error. Your code: ' + code,
                    devCode: code
                });
            }

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // @route POST /api/auth/verify
    router.post('/verify', async (req, res) => {
        try {
            const { email, code } = req.body;

            const user = await User.findOne({
                email: email.toLowerCase()
            }).select('+verificationCode +verificationCodeExpires');

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            if (user.isVerified) {
                return res.status(400).json({ message: 'Email уже подтверждён' });
            }

            // Проверка кода и срока действия
            if (user.verificationCode !== code) {
                return res.status(400).json({ message: 'Неверный код' });
            }

            if (Date.now() > user.verificationCodeExpires) {
                return res.status(400).json({ message: 'Код истёк. Запросите новый' });
            }

            // Верификация
            user.isVerified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following,
                token: generateToken(user._id)
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // @route POST /api/auth/login
    //СЮДА ГЛЯНЬ
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            console.log('=== ЛОГИН ===');
            console.log('Email:', email);

            const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

            console.log('Пользователь найден:', !!user);

            if (!user) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            const isMatch = await user.matchPassword(password);
            console.log('Пароль совпадает:', isMatch);

            if (!isMatch) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            // ВРЕМЕННО: пропускаем проверку верификации
            // if (!user.isVerified) {
            //     return res.status(401).json({
            //         message: 'Email не подтверждён',
            //         needsVerification: true
            //     });
            // }

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following,
                token: generateToken(user._id)
            });
        } catch (error) {
            console.error('Ошибка логина:', error);
            res.status(500).json({ message: error.message });
        }
    });

    // @route GET /api/auth/me
    router.get('/me', protect, async (req, res) => {
        try {
            res.json(req.user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // ================= FOLLOW / UNFOLLOW =================

    // @route POST /api/auth/follow/:username
    router.post('/follow/:username', protect, async (req, res) => {
        try {
            const targetUsername = req.params.username.trim();

            const userToFollow = await User.findOne({
                username: { $regex: new RegExp(`^${targetUsername}$`, 'i') }
            });

            const currentUser = await User.findById(req.user._id);

            if (!userToFollow) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (userToFollow._id.equals(currentUser._id)) {
                return res.status(400).json({ message: 'You cannot follow yourself' });
            }

            if (currentUser.following.includes(userToFollow._id)) {
                return res.status(400).json({ message: 'Already following' });
            }

            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);

            await currentUser.save();
            await userToFollow.save();

            res.json({
                following: currentUser.following,
                followers: userToFollow.followers
            });
        } catch (error) {
            console.error('FOLLOW ERROR:', error);
            res.status(500).json({ message: error.message });
        }
    });

    // @route POST /api/auth/unfollow/:username
    router.post('/unfollow/:username', protect, async (req, res) => {
        try {
            const targetUsername = req.params.username.trim();

            const userToUnfollow = await User.findOne({
                username: { $regex: new RegExp(`^${targetUsername}$`, 'i') }
            });

            const currentUser = await User.findById(req.user._id);

            if (!userToUnfollow) {
                return res.status(404).json({ message: 'User not found' });
            }

            currentUser.following = currentUser.following.filter(
                id => id.toString() !== userToUnfollow._id.toString()
            );

            userToUnfollow.followers = userToUnfollow.followers.filter(
                id => id.toString() !== currentUser._id.toString()
            );

            await currentUser.save();
            await userToUnfollow.save();

            res.json({
                following: currentUser.following,
                followers: userToUnfollow.followers
            });
        } catch (error) {
            console.error('UNFOLLOW ERROR:', error);
            res.status(500).json({ message: error.message });
        }
    });

    // ================= GET USER PROFILE =================

    // @route GET /api/auth/user/:username
    // @desc Get user by username
    // @access Public
    router.get('/user/:username', async (req, res) => {
        try {
            const user = await User.findOne({
                username: { $regex: new RegExp(`^${req.params.username}$`, 'i') }
            }).select('-password -verificationCode -verificationCodeExpires');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following
            });
        } catch (error) {
            console.error('GET USER ERROR:', error);
            res.status(500).json({ message: error.message });
        }
    });

    module.exports = router;
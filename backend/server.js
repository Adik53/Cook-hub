require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/protected'));

app.get('/', (req, res) => {
    res.json({ message: '🍳 Cook Hub API работает!' });
});

async function createAdminAccount() {
    try {
        const adminExists = await User.findOne({ username: 'CookHub Demo' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin12345', 10);

            await User.create({
                username: 'CookHub Demo',
                email: 'admin@cookhub.app',
                password: hashedPassword,
                bio: 'Официальный аккаунт CookHub. Лучшие рецепты от команды проекта! 🍳',
                avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400',
                isVerified: true,
                role: 'admin',
                followers: [],
                following: []
            });

            console.log('✅ Админ-аккаунт создан: CookHub Demo (пароль: admin12345)');
        } else {
            console.log('Админ-аккаунт уже существует');
        }
    } catch (error) {
        console.error('Ошибка создания админа:', error);
    }
}

createAdminAccount();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Бэкенд запущен на http://localhost:${PORT}`);
});
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/protected'));

// ДОБАВЬ ЭТО (главная страница):
app.get('/', (req, res) => {
    res.json({ message: '🍳 Cook Hub API работает!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Бэкенд запущен на http://localhost:${PORT}`);
});
const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, (req, res) => {
    res.json({ message: `Привет, ${req.user.username}!` });
});

module.exports = router;
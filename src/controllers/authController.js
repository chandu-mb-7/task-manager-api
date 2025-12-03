const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// POST /users/register
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /users/login
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { register, login };

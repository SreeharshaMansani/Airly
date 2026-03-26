const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST http://localhost:8080/api/auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('users')
        .insert({ name, email, password: hashedPassword })
        .select('id, name, email, created_at')
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({
        message: 'User created successfully',
        user: data,
    });
});

// POST http://localhost:8080/api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data: user } = await supabase
        .from('users')
        .select('id, name, email, password')
        .eq('email', email)
        .single();

    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
});

module.exports = router;
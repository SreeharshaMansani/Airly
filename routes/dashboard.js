const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../User/auth');

// GET /api/dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
    const userId = req.user.id;

    const [holdingsResult, cleanersResult] = await Promise.all([
        supabase.from('holdings').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('cleaners').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    if (holdingsResult.error) return res.status(500).json({ error: holdingsResult.error.message });
    if (cleanersResult.error) return res.status(500).json({ error: cleanersResult.error.message });

    res.json({
        user_id: userId,
        holdings: holdingsResult.data,
        cleaners: cleanersResult.data,
    });
});

module.exports = router;
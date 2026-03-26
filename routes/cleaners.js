const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../User/auth');


// GET all cleaners
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('cleaners')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET single cleaner
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('cleaners')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Cleaner not found' });
    res.json(data);
});

// POST create cleaner
router.post('/', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { name, phone_number, street, city, state, country, zip } = req.body;

    const { data, error } = await supabase
        .from('cleaners')
        .insert({ user_id: userId, name, phone_number, street, city, state, country, zip })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Cleaner created successfully', cleaner: data });
});

// PUT update cleaner
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, phone_number, street, city, state, country, zip } = req.body;

    const { data: existing } = await supabase
        .from('cleaners')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (!existing) return res.status(404).json({ error: 'Cleaner not found or unauthorized' });

    const { data, error } = await supabase
        .from('cleaners')
        .update({ name, phone_number, street, city, state, country, zip })
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Cleaner updated successfully', cleaner: data });
});

// DELETE cleaner
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: existing } = await supabase
        .from('cleaners')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (!existing) return res.status(404).json({ error: 'Cleaner not found or unauthorized' });

    const { error } = await supabase
        .from('cleaners')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Cleaner deleted successfully' });
});

module.exports = router;
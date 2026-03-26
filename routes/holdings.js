const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../User/auth');

// GET all holdings
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PUT /api/holdings/:id/assign-cleaner
router.put('/:id/assign-cleaner', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { cleaner_id } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('holdings')
        .update({ cleaner_id })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Cleaner assigned successfully', holding: data });
});


// GET single holding
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Holding not found' });
    res.json(data);
});

// POST create holding
router.post('/', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { name, street, city, state, country, zip, ical_url } = req.body;

    const { data, error } = await supabase
        .from('holdings')
        .insert({ user_id: userId, name, street, city, state, country, zip, ical_url })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Holding created successfully', holding: data });
});

// PUT update holding
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, street, city, state, country, zip, ical_url } = req.body;

    const { data: existing } = await supabase
        .from('holdings')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (!existing) return res.status(404).json({ error: 'Holding not found or unauthorized' });

    const { data, error } = await supabase
        .from('holdings')
        .update({ name, street, city, state, country, zip, ical_url })
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Holding updated successfully', holding: data });
});

// DELETE holding
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: existing } = await supabase
        .from('holdings')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (!existing) return res.status(404).json({ error: 'Holding not found or unauthorized' });

    const { error } = await supabase
        .from('holdings')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Holding deleted successfully' });
});

module.exports = router;
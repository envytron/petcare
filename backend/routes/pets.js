const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all pets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pets ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single pet
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pet not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create pet
router.post('/', async (req, res) => {
  try {
    const { name, breed, age, img } = req.body;
    const [result] = await db.query(
      'INSERT INTO pets (name, breed, age, img) VALUES (?, ?, ?, ?)',
      [name, breed, age, img || 'imgs/labrador.png']
    );
    res.status(201).json({ id: result.insertId, name, breed, age, img });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update pet
router.put('/:id', async (req, res) => {
  try {
    const { name, breed, age, img } = req.body;
    await db.query(
      'UPDATE pets SET name = ?, breed = ?, age = ?, img = ? WHERE id = ?',
      [name, breed, age, img, req.params.id]
    );
    res.json({ message: 'Pet updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE pet
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM logs WHERE pet_id = ?', [req.params.id]);
    await db.query('DELETE FROM pets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Pet deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
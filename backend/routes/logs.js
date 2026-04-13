const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all logs for a pet
router.get('/:petId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM logs WHERE pet_id = ? ORDER BY created_at DESC',
      [req.params.petId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create log
router.post('/', async (req, res) => {
  try {
    const { pet_id, type, note } = req.body;
    const [result] = await db.query(
      'INSERT INTO logs (pet_id, type, note) VALUES (?, ?, ?)',
      [pet_id, type, note]
    );
    res.status(201).json({ id: result.insertId, pet_id, type, note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE log
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM logs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Log deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

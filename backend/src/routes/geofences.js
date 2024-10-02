const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get all geofences
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM geofences');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new geofence
router.post('/', async (req, res) => {
  const { center, radius } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO geofences (center_lat, center_lng, radius) VALUES (?, ?, ?)',
      [center.lat, center.lng, radius]
    );
    res.status(201).json({ id: result.insertId, center, radius });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a geofence
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { center, radius } = req.body;
  try {
    await pool.query(
      'UPDATE geofences SET center_lat = ?, center_lng = ?, radius = ? WHERE id = ?',
      [center.lat, center.lng, radius, id]
    );
    res.status(200).json({ id, center, radius });
  } catch (err) {
    console.error('Error updating geofence:', err);
    res.status(500).json({ error: 'Failed to update geofence' });
  }
});


// Delete a geofence 
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM geofences WHERE id = ?', [id]);
    res.status(200).json({ message: 'Geofence deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
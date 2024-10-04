const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get all geofences
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM geofences ORDER BY id');
    const formattedGeofences = rows.map(row => ({
      id: row.id,
      center: {
        lat: row.center_lat,
        lng: row.center_lng
      },
      radius: row.radius,
      type: row.type
    }));
    res.json(formattedGeofences);
  } catch (err) {
    console.error('Error fetching geofences:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single geofence by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM geofences WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Geofence not found' });
    }
    const geofence = {
      id: rows[0].id,
      center: {
        lat: rows[0].center_lat,
        lng: rows[0].center_lng
      },
      radius: rows[0].radius,
      type: rows[0].type
    };
    res.json(geofence);
  } catch (err) {
    console.error('Error fetching geofence:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new geofence
router.post('/', async (req, res) => {
  const { center, radius, type } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Find the lowest available ID starting from 1
    const [rows] = await connection.query(`
      SELECT COALESCE(MIN(t1.id + 1), 1) AS next_id
      FROM geofences t1
      LEFT JOIN geofences t2 ON t1.id + 1 = t2.id
      WHERE t2.id IS NULL
    `);
    
    const nextId = rows[0].next_id;

    // Insert the new geofence with the found ID
    const [result] = await connection.query(
      'INSERT INTO geofences (id, center_lat, center_lng, radius, type) VALUES (?, ?, ?, ?, ?)',
      [nextId, center.lat, center.lng, radius, type]
    );

    await connection.commit();
    
    res.status(201).json({ id: nextId, center, radius, type });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating geofence:', err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// Update a geofence
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { center, radius, type } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE geofences SET center_lat = ?, center_lng = ?, radius = ?, type = ? WHERE id = ?',
      [center.lat, center.lng, radius, type, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Geofence not found' });
    }
    res.status(200).json({ id: parseInt(id), center, radius, type });
  } catch (err) {
    console.error('Error updating geofence:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a geofence 
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM geofences WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Geofence not found' });
    }
    res.status(200).json({ message: 'Geofence deleted successfully' });
  } catch (err) {
    console.error('Error deleting geofence:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
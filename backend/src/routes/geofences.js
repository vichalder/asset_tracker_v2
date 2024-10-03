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

// Create a new geofence
router.post('/', async (req, res) => {
  const { center, radius, type } = req.body;
  try {
    // Find the lowest available ID
    const [rows] = await pool.query('SELECT id FROM geofences ORDER BY id');
    let newId = 1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id !== newId) {
        break;
      }
      newId++;
    }

    const [result] = await pool.query(
      'INSERT INTO geofences (id, center_lat, center_lng, radius, type) VALUES (?, ?, ?, ?, ?)',
      [newId, center.lat, center.lng, radius, type]
    );
    res.status(201).json({ id: newId, center, radius, type });
  } catch (err) {
    console.error('Error creating geofence:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a geofence
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { center, radius, type } = req.body;
  console.log('Received update request for geofence ID:', id);
  console.log('Update data:', { center, radius, type });

  if (id === undefined) {
    console.error('Geofence ID is undefined');
    return res.status(400).json({ error: 'Geofence ID is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE geofences SET center_lat = ?, center_lng = ?, radius = ?, type = ? WHERE id = ?',
      [center.lat, center.lng, radius, type, id]
    );
    console.log('Update operation result:', result);

    if (result.affectedRows === 0) {
      console.log('No geofence found with ID:', id);
      return res.status(404).json({ error: 'Geofence not found' });
    }

    console.log('Successfully updated geofence with ID:', id);
    res.status(200).json({ id: parseInt(id), center, radius, type });
  } catch (err) {
    console.error('Error updating geofence:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a geofence 
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Received delete request for geofence ID:', id);

  if (id === undefined) {
    console.error('Geofence ID is undefined');
    return res.status(400).json({ error: 'Geofence ID is required' });
  }

  try {
    const [result] = await pool.query('DELETE FROM geofences WHERE id = ?', [id]);
    console.log('Delete operation result:', result);

    if (result.affectedRows === 0) {
      console.log('No geofence found with ID:', id);
      return res.status(404).json({ error: 'Geofence not found' });
    }

    console.log('Successfully deleted geofence with ID:', id);
    res.status(200).json({ message: 'Geofence deleted successfully' });
  } catch (err) {
    console.error('Error deleting geofence:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
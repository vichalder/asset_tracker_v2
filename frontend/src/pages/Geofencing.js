import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

function Geofencing() {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/geofences');
        setGeofences(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching geofences. Please try again later.');
        setLoading(false);
      }
    };

    fetchGeofences();
  }, []);

  const handleCreated = async (e) => {
    const { layer } = e;
    const { _latlng, _mRadius } = layer;
    const newGeofence = { center: _latlng, radius: _mRadius };
    
    try {
      const response = await axios.post('http://localhost:3000/api/geofences', newGeofence);
      setGeofences([...geofences, response.data]);
    } catch (err) {
      setError('Error creating geofence. Please try again.');
    }
  };

  const handleEdited = async (e) => {
    const { layers } = e;
    layers.eachLayer(async (layer) => {
      const { _leaflet_id, _latlng, _mRadius } = layer;
      const updatedGeofence = { center: _latlng, radius: _mRadius };
      
      try {
        await axios.put(`http://localhost:3000/api/geofences/${_leaflet_id}`, updatedGeofence);
        setGeofences(geofences.map(g => g.id === _leaflet_id ? { ...g, ...updatedGeofence } : g));
      } catch (err) {
        setError('Error updating geofence. Please try again.');
      }
    });
  };

  const handleDeleted = async (e) => {
    const { layers } = e;
    layers.eachLayer(async (layer) => {
      const { _leaflet_id } = layer;
      
      try {
        await axios.delete(`http://localhost:3000/api/geofences/${_leaflet_id}`);
        setGeofences(geofences.filter(g => g.id !== _leaflet_id));
      } catch (err) {
        setError('Error deleting geofence. Please try again.');
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Geofencing</h1>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            onDeleted={handleDeleted}
            draw={{
              rectangle: false,
              polygon: false,
              polyline: false,
              marker: false,
              circlemarker: false,
            }}
          />
          {geofences.map((geofence) => (
            <Circle 
              key={geofence.id} 
              center={[geofence.center.lat, geofence.center.lng]} 
              radius={geofence.radius} 
            />
          ))}
        </FeatureGroup>
      </MapContainer>
      <div>
        <h2>Geofences:</h2>
        <ul>
          {geofences.map((geofence) => (
            <li key={geofence.id}>
              Center: {geofence.center.lat.toFixed(6)}, {geofence.center.lng.toFixed(6)} - 
              Radius: {geofence.radius.toFixed(2)}m
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Geofencing;
import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

function Geofencing() {
  const [geofences, setGeofences] = useState([]);

  const handleCreated = (e) => {
    const { layer } = e;
    const { _latlng, _mRadius } = layer;
    setGeofences([...geofences, { center: _latlng, radius: _mRadius }]);
  };

  return (
    <div>
      <h1>Geofencing</h1>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: false,
              polygon: false,
              polyline: false,
              marker: false,
              circlemarker: false,
            }}
          />
          {geofences.map((geofence, index) => (
            <Circle key={index} center={geofence.center} radius={geofence.radius} />
          ))}
        </FeatureGroup>
      </MapContainer>
      <div>
        <h2>Geofences:</h2>
        <ul>
          {geofences.map((geofence, index) => (
            <li key={index}>
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
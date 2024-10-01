import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function HistoricalView() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/devices');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const fetchHistoricalData = async (deviceId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/devices/${deviceId}/history`);
      setHistoricalData(response.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const handleDeviceSelect = (event) => {
    const deviceId = event.target.value;
    setSelectedDevice(deviceId);
    if (deviceId) {
      fetchHistoricalData(deviceId);
    } else {
      setHistoricalData([]);
    }
  };

  const positions = historicalData.map(point => [point.latitude, point.longitude]);

  return (
    <div>
      <h1>Historical View</h1>
      <select onChange={handleDeviceSelect} value={selectedDevice || ''}>
        <option value="">Select a device</option>
        {devices.map(device => (
          <option key={device.id} value={device.id}>{device.name}</option>
        ))}
      </select>
      {selectedDevice && (
        <MapContainer center={positions[0] || [0, 0]} zoom={13} style={{ height: '500px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={positions} />
        </MapContainer>
      )}
    </div>
  );
}

export default HistoricalView;
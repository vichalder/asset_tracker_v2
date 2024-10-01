import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/devices');
        setDevices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching devices. Please try again later.');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Device List</h1>
      {devices.length === 0 ? (
        <p>No devices found.</p>
      ) : (
        <ul>
          {devices.map(device => (
            <li key={device.id}>
              {device.name} - Type: {device.type}, Status: {device.status}, 
              Last seen: {device.last_latitude}, {device.last_longitude}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeviceList;
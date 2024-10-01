import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeviceList() {
  const [devices, setDevices] = useState([]);

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

  return (
    <div>
      <h1>Device List</h1>
      <ul>
        {devices.map(device => (
          <li key={device.id}>
            {device.name} - Type: {device.type}, Status: {device.status}, 
            Last seen: {device.last_latitude}, {device.last_longitude}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeviceList;
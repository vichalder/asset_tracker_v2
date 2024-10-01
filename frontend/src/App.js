import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DeviceList from './pages/DeviceList';
import MapView from './pages/MapView';
import HistoricalView from './pages/HistoricalView';
import Geofencing from './pages/Geofencing';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/historical" element={<HistoricalView />} />
          <Route path="/geofencing" element={<Geofencing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
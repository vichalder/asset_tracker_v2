import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeviceList from './pages/DeviceList';
import MapView from './pages/MapView';
import HistoricalView from './pages/HistoricalView';
import Geofencing from './pages/Geofencing';
import AlertConfiguration from './pages/AlertConfiguration';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<DeviceList />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/historical" element={<HistoricalView />} />
            <Route path="/geofencing" element={<Geofencing />} />
            <Route path="/alerts" element={<AlertConfiguration />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
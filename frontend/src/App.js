import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
        <Switch>
          <Route exact path="/" component={DeviceList} />
          <Route path="/map" component={MapView} />
          <Route path="/historical" component={HistoricalView} />
          <Route path="/geofencing" component={Geofencing} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
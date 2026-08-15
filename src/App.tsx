import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import RiskMapPage from './pages/RiskMap';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import About from './pages/About';

export default function App() {
  const [locationId, setLocationId] = useState('jaipur');

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                locationId={locationId}
                onLocationChange={setLocationId}
              />
            }
          />
          <Route
            path="/risk-map"
            element={
              <RiskMapPage
                locationId={locationId}
                onLocationChange={setLocationId}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <Analytics
                locationId={locationId}
                onLocationChange={setLocationId}
              />
            }
          />
          <Route
            path="/alerts"
            element={
              <Alerts
                locationId={locationId}
                onLocationChange={setLocationId}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore } from './stores/authStore';
import { FlightsPage } from './pages/FlightsPage';
import { SeatMapPage } from './pages/SeatMapPage';

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
          />
          <Route 
            path="/flights" 
            element={isAuthenticated ? <FlightsPage /> : <Navigate to="/login" />} 
          />
          <Route path="/seat-map/:flightId" element={<SeatMapPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

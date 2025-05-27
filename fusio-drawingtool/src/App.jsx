// src/App.jsx
import './App.css';
import { Routes, Route } from "react-router";
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CanvasPage from './pages/CanvasPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RequireAuth from './component/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/democanvas" element={<CanvasPage />} />
      <Route path="/demodashboard" element={<DashboardPage/>} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/canvas/:canvasId"
        element={
          <RequireAuth>
            <CanvasPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Patient from './components/Patient';
import Doctor from './components/Doctor';
import Appointment from './components/Appointment';
import Report from './components/Report';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAccount />} />

        {/* Protected Dashboard Layout Routes */}
        <Route path="/" element={<ProtectedRoute><Navbar /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patient />} />
          <Route path="doctors" element={<Doctor />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="reports" element={<Report />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
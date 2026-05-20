import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Gidugangan nato og ./ sa sugod ang tanan kay naa raman ni sila sa sulod sa src folder
import { AuthProvider } from './features/authentication/context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import Login from './features/authentication/pages/Login';
import Register from './features/authentication/pages/Register';
import Profile from './features/user/pages/Profile';
import Settings from './features/user/pages/Settings';
import Dashboard from './features/movies/pages/Dashboard';
import MovieDetails from './features/movies/pages/MovieDetails';
import AdminDashboard from './features/admin/pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
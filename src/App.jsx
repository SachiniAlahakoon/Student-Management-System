import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* after login you will navigate to /dashboard later */}
        <Route
          path="/dashboard"
          element={<div style={{ padding: 40 }}>Admin Dashboard (placeholder)</div>}
        />
      </Routes>
    </Router>
  );
}



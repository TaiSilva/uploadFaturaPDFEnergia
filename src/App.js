import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './NavBar';
import FileUpload from './FileUpload';
import Dashboard from './Dashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<FileUpload />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BrowseBooks from './pages/BrowseBooks';
import BookDetail from './pages/BookDetail';
import './styles.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">BookVerse</Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/browse" className="nav-link">Browse</Link>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseBooks />} />
          <Route path="/book/:id" element={<BookDetail />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2025 BookVerse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 
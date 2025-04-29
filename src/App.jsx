import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BrowseBooks from './pages/BrowseBooks';
import BookDetail from './pages/BookDetail';
;
import SignUpPage from './pages/SignUpPage';
import FavoritesPage from './pages/FavoritesPage';
import { FavoritesProvider } from './context/FavoritesContext';
import './styles.css';

function App() {
  return (
    <FavoritesProvider>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">BookVerse</Link>
            <nav className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/browse" className="nav-link">Browse</Link>
              <Link to="/favorites" className="nav-link">
                Favorites
                <span className="favorite-icon">❤️</span>
              </Link>
              {/* <Link to="/login" className="nav-link login-button">Login</Link> */}
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowseBooks />} />
            <Route path="/book/:id" element={<BookDetail />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 BookVerse. All rights reserved.</p>
        </footer>
      </div>
    </FavoritesProvider>
  );
}

export default App; 
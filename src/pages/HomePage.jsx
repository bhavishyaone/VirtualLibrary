import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-content" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
        <h1>Welcome to BookVerse</h1>
        <p>Your digital library for exploring great books</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/browse" className="browse-button">
            Browse Books
          </Link>
        </div>
      </div>
      <div className="features">
        <div className="feature-card">
          <h3>📚 Extensive Collection</h3>
          <p>Access thousands of books across various genres</p>
        </div>
        <div className="feature-card">
          <h3>🔍 Easy Search</h3>
          <p>Find your next favorite book with our powerful search</p>
        </div>
        <div className="feature-card">
          <h3>📱 Read Anywhere</h3>
          <p>Enjoy your books on any device, anytime</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage 
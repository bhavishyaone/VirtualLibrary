import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h1>My Favorites</h1>
        <p>You haven't added any books to your favorites yet.</p>
        <Link to="/browse" className="browse-button">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      <div className="book-grid">
        {favorites.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-cover-container">
              <img src={book.coverImage} alt={book.title} />
              <div className="book-overlay">
                <Link to={`/book/${book.id}`} className="preview-button">View Details</Link>
              </div>
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
              <button 
                className="favorite-button active"
                onClick={() => removeFavorite(book.id)}
                aria-label="Remove from favorites"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage; 
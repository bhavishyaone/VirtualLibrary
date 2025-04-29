import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import { useFavorites } from '../context/FavoritesContext';

const BookSkeleton = () => (
  <div className="book-card skeleton">
    <div className="book-cover-container skeleton-cover"></div>
    <div className="book-info">
      <div className="skeleton-title"></div>
      <div className="skeleton-author"></div>
      <div className="skeleton-genre"></div>
    </div>
  </div>
);

// Helper function to handle fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

function BrowseBooks() {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (query = '', pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const url = query 
        ? `https://gutendex.com/books/?search=${encodeURIComponent(query)}&page=${pageNum}`
        : `https://gutendex.com/books/?page=${pageNum}`;

      const response = await fetchWithTimeout(url);
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response format from server');
      }

      setBooks(prevBooks => pageNum === 1 ? data.results : [...prevBooks, ...data.results]);
      setHasMore(data.next !== null);
    } catch (err) {
      setError(err.message || 'Failed to fetch books. Please try again later.');
      if (pageNum === 1) {
        setBooks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }
    setPage(1);
    fetchBooks(searchQuery, 1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBooks(searchQuery, nextPage);
    }
  };

  const handleFavoriteClick = (book) => {
    if (isFavorite(book.id)) {
      removeFavorite(book.id);
    } else {
      addFavorite(book);
    }
  };

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => fetchBooks(searchQuery, page)} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse Books</h1>
        <p>Discover your next favorite read</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && page === 1 ? (
        <div className="book-grid">
          {[...Array(6)].map((_, index) => (
            <BookSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <Link to={`/book/${book.id}`} key={book.id} className="book-card">
                <div className="book-cover-container">
                  {book.formats['image/jpeg'] ? (
                    <img
                      src={book.formats['image/jpeg']}
                      alt={book.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                      }}
                    />
                  ) : (
                    <div className="skeleton-cover" />
                  )}
                  <div className="book-overlay">
                    <span>View Details</span>
                  </div>
                  <button 
                    className={`favorite-button ${isFavorite(book.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavoriteClick(book);
                    }}
                    aria-label={isFavorite(book.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite(book.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.authors?.[0]?.name || 'Unknown Author'}</p>
                  <div className="book-meta">
                    <span className="publish-date">
                      {book.download_count ? `${book.download_count.toLocaleString()} downloads` : 'No download data'}
                    </span>
                    {book.formats['text/html'] && <span className="preview-badge">Preview Available</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {loading && page > 1 && (
            <div className="book-grid">
              {[...Array(3)].map((_, index) => (
                <BookSkeleton key={index} />
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <div className="load-more">
              <button className="load-more-button" onClick={loadMore}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BrowseBooks; 
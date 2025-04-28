import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles.css';

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

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch book details
        const response = await fetchWithTimeout(`https://gutendex.com/books/${id}`);
        const bookData = await response.json();
        
        if (!bookData) {
          throw new Error('Invalid book data received');
        }
        
        setBook(bookData);
      } catch (err) {
        setError(err.message || 'Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="book-detail loading">
        <div className="skeleton-cover" />
        <div className="skeleton-title" />
        <div className="skeleton-author" />
        <div className="skeleton-description" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="error">
        Book not found
        <Link to="/browse" className="back-button">
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <Link to="/browse" className="back-button">
          ← Back to Browse
        </Link>
      </div>

      <div className="book-detail-content">
        <div className="book-cover">
          {book.formats?.['image/jpeg'] ? (
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
          {book.formats?.['text/html'] && (
            <a
              href={book.formats['text/html']}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-button"
            >
              Preview Book
            </a>
          )}
        </div>

        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="author">
            by {book.authors?.[0]?.name || 'Unknown Author'}
          </p>
          <div className="book-rating">
            {'★'.repeat(Math.floor(Math.random() * 5) + 1)}
            {'☆'.repeat(5 - (Math.floor(Math.random() * 5) + 1))}
          </div>
          <div className="book-meta">
            <span className="downloads">
              {book.download_count ? `${book.download_count.toLocaleString()} downloads` : 'No download data'}
            </span>
          </div>
          <div className="book-description">
            <h2>Description</h2>
            <p>
              {book.subjects?.join(', ') || 'No subjects available'}
            </p>
          </div>
          {book.languages && (
            <div className="book-languages">
              <h2>Languages</h2>
              <div className="language-tags">
                {book.languages.map((language, index) => (
                  <span key={index} className="language-tag">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/components/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!book) return <div className="not-found">Book not found</div>;

  return (
    <div className="book-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Books
      </button>
      
      <div className="book-content">
        <div className="book-cover">
          <img src={book.coverImage} alt={book.title} />
        </div>
        
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
          
          <div className="book-meta">
            <span className="genre">{book.genre}</span>
            <span className="rating">★ {book.rating}</span>
          </div>
          
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
          
          <div className="book-details-meta">
            <div className="detail-item">
              <span className="label">Published:</span>
              <span className="value">{book.publicationDate}</span>
            </div>
            <div className="detail-item">
              <span className="label">Pages:</span>
              <span className="value">{book.pages}</span>
            </div>
            <div className="detail-item">
              <span className="label">ISBN:</span>
              <span className="value">{book.isbn}</span>
            </div>
          </div>
          
          <div className="book-actions">
            <button className="borrow-button">Borrow Book</button>
            <button className="wishlist-button">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../pages/Toast';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Load favorites from localStorage on initial render
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('bookverse-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [toast, setToast] = useState(null);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookverse-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const addFavorite = (book) => {
    setFavorites(prev => {
      if (!prev.some(item => item.id === book.id)) {
        showToast(`${book.title} added to favorites`, 'success');
        return [...prev, book];
      }
      return prev;
    });
  };

  const removeFavorite = (bookId) => {
    setFavorites(prev => {
      const book = prev.find(item => item.id === bookId);
      if (book) {
        showToast(`${book.title} removed from favorites`, 'success');
      }
      return prev.filter(book => book.id !== bookId);
    });
  };

  const isFavorite = (bookId) => {
    return favorites.some(book => book.id === bookId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        </div>
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 
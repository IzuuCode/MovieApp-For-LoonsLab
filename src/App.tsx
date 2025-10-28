import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

/**
 * Main Application Component
 * 
 * This is the root component that:
 * - Wraps the app in Context Providers for global state management
 * - Configures routing with React Router
 * - Defines the overall layout structure (Navbar, Main Content, Footer)
 * - Sets the document title on mount
 */
function App() {
  // Set document title on initial mount
  useEffect(() => {
    document.title = 'MovieVerse - Explore the World of Movies';
    // Also update the title element in case it was changed elsewhere
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleElement.textContent = 'MovieVerse - Explore the World of Movies';
    }
  }, []);

  return (
    // Context Provider Hierarchy: Theme → Auth → Movie
    // This order ensures proper state dependencies
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <Router>
            {/* Flexbox layout: navbar, flexible main content, footer */}
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected Routes - Requires Authentication */}
                  <Route 
                    path="/favorites" 
                    element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
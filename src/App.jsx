import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './App.css';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard';
import { searchMovies } from './tmdb';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setMovies([]);
      setPage(1);
      fetchMovies(query, 1);
    }
  }, [query]);

  const fetchMovies = async (query, pageNum) => {
    setLoading(true);
    try {
      const results = await searchMovies(query, pageNum);
      if (!results || results.length === 0) {
        if (pageNum === 1) {
          setError('No results found.');
        }
        setHasMore(false);
      } else {
        setError('');
        setMovies(prev => (pageNum === 1 ? results : [...prev, ...results]));
        // TMDB returns up to 20 results per page, and has max 1000 pages
        setHasMore(results.length >= 20);
      }
    } catch (error) {
      setError('Error fetching movies. Please try again.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    if (q.trim()) {
      setSearchParams({ q: q.trim() });
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      fetchMovies(query, nextPage);
      setPage(nextPage);
    }
  };

  return (
    <div className="App">
      <h1>🎬 Movie Finder</h1>
      <SearchBar onSearch={handleSearch} defaultQuery={query} />
      {error && <p className="error-text">{error}</p>}
      {loading && page === 1 && <p>Loading movies...</p>}
      
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>

      {hasMore && !loading && (
        <button className="load-more-btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
      
      {loading && page > 1 && <p>Loading more movies...</p>}
    </div>
  );
}

export default App;
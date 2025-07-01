import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './App.css';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard';
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [movies, setMovies] = useState([]); // search results
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get('q') || '';

  // Fetch TMDB rows for Netflix-like homepage
  const fetchTMDBRows = async () => {
    setLoading(true);
    try {
      const API_KEY = process.env.REACT_APP_TMDB_KEY;
      const BASE_URL = 'https://api.themoviedb.org/3';
      const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
      // Trending
      const trendingRes = await axios.get(`${BASE_URL}/trending/movie/day`, {
        params: { api_key: API_KEY, page: 1 },
      });
      // Top Rated
      const topRatedRes = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: { api_key: API_KEY, page: 1 },
      });
      // Now Playing
      const nowPlayingRes = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: { api_key: API_KEY, page: 1 },
      });
      // Map results
      const mapMovies = (arr) => arr.map(movie => ({
        id: movie.id,
        imdbID: movie.id.toString(),
        Title: movie.title,
        Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        Poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'N/A',
        Type: 'movie',
        original_title: movie.original_title,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        tagline: '',
      }));
      setTrending(mapMovies(trendingRes.data.results));
      setTopRated(mapMovies(topRatedRes.data.results));
      setNowPlaying(mapMovies(nowPlayingRes.data.results));
      setError('');
    } catch (error) {
      setError('Error fetching movies.');
      setTrending([]);
      setTopRated([]);
      setNowPlaying([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setMovies([]);
      setPage(1);
      fetchMovies(query, 1);
    } else {
      fetchTMDBRows();
    }
    // eslint-disable-next-line
  }, [query]);

  const fetchMovies = async (query, pageNum) => {
    setLoading(true);
    try {
      const API_KEY = process.env.REACT_APP_TMDB_KEY;
      const BASE_URL = 'https://api.themoviedb.org/3';
      const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
      const res = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          page: pageNum,
        },
      });
      const results = res.data.results.map(movie => ({
        id: movie.id,
        imdbID: movie.id.toString(),
        Title: movie.title,
        Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        Poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'N/A',
        Type: 'movie',
        original_title: movie.original_title,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        tagline: '',
      }));
      if (!results || results.length === 0) {
        if (pageNum === 1) {
          setError('No results found.');
        }
        setHasMore(false);
      } else {
        setError('');
        setMovies(prev => (pageNum === 1 ? results : [...prev, ...results]));
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

  // Helper: Render a horizontal scroll row for movies
  const renderMovieRow = (title, movies) => (
    <div className="movie-row">
      <div className="movie-row-title">{title}</div>
      <div className="movie-row-cards">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} className="movie-row-card" key={movie.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.Title}
              style={{ width: '100%', borderRadius: '8px 8px 0 0', background: '#111' }}
            />
            <h4>{movie.Title}</h4>
            <p>{movie.Year}</p>
            {movie.vote_average && (
              <p>⭐ {movie.vote_average.toFixed(1)}/10</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  // Hero banner uses first trending movie
  const heroMovie = !query && trending.length > 0 ? trending[0] : (movies.length > 0 ? movies[0] : null);

  return (
    <div className="App">
      {/* Netflix-style Hero Banner */}
      {heroMovie && heroMovie.backdrop_path && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: `linear-gradient(90deg, #181818ee 40%, #18181888 100%), url(${heroMovie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '18px',
            margin: '0 auto 36px auto',
            maxWidth: '1200px',
            minHeight: '340px',
            display: 'flex',
            alignItems: 'flex-end',
            boxShadow: '0 8px 32px #000a',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '36px 48px',
            color: '#fff',
            textAlign: 'left',
            maxWidth: '60%',
            zIndex: 2,
          }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', marginBottom: 8, textShadow: '2px 2px 12px #000a' }}>
              {heroMovie.Title} <span style={{ color: '#e50914', fontWeight: 700 }}>({heroMovie.Year})</span>
            </h2>
            {heroMovie.tagline && (
              <p style={{ fontStyle: 'italic', color: '#e50914', marginBottom: 10, fontWeight: 500, fontSize: '1.1rem' }}>
                "{heroMovie.tagline}"
              </p>
            )}
            <p style={{ color: '#fff', fontSize: '1.05rem', marginBottom: 18, textShadow: '1px 1px 8px #000a' }}>
              {heroMovie.overview?.length > 180 ? heroMovie.overview.slice(0, 180) + '...' : heroMovie.overview}
            </p>
            <a
              href={`/movie/${heroMovie.id}`}
              className="hero-btn"
              style={{
                display: 'inline-block',
                background: '#e50914',
                color: '#fff',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1.1rem',
                textDecoration: 'none',
                boxShadow: '0 2px 12px #000a',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#b0060f')}
              onMouseOut={e => (e.currentTarget.style.background = '#e50914')}
            >
              View Details
            </a>
          </div>
        </div>
      )}
      {/* The Movie Database standout title */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 36,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Oswald, Montserrat, Arial, sans-serif',
          fontSize: '2.8rem',
          fontWeight: 900,
          letterSpacing: 3,
          textShadow: '0 4px 24px #e50914cc, 2px 2px 12px #000a',
          textTransform: 'uppercase',
        }}>
          <span style={{ fontSize: '2.2rem', marginRight: 14, filter: 'drop-shadow(0 2px 6px #e50914)' }}>🎬</span>
          <span style={{ color: '#fff' }}>The Movie </span>
          <span style={{ color: '#e50914', marginLeft: 10 }}>Database</span>
        </div>
        <div style={{
          width: 260,
          height: 7,
          background: 'linear-gradient(90deg, #e50914 70%, transparent 100%)',
          borderRadius: 4,
          marginTop: 10,
          boxShadow: '0 2px 16px #e50914cc',
        }} />
      </div>
      <SearchBar onSearch={handleSearch} defaultQuery={query} />
      {error && <p className="error-text">{error}</p>}
      {loading && page === 1 && <p>Loading movies...</p>}
      {/* Netflix-style rows */}
      {!query && trending.length > 0 && renderMovieRow('Trending Now', trending.slice(0, 12))}
      {!query && topRated.length > 0 && renderMovieRow('Top Rated', topRated.slice(0, 12))}
      {!query && nowPlaying.length > 0 && renderMovieRow('Now Playing', nowPlaying.slice(0, 12))}
      {/* Search results grid */}
      {query && (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
      {hasMore && !loading && query && (
        <button className="load-more-btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
      {loading && page > 1 && <p>Loading more movies...</p>}
      {/* Footer */}
      <footer style={{
        width: '100%',
        background: 'linear-gradient(90deg, #181818 60%, #232526 100%)',
        color: '#fff',
        textAlign: 'center',
        padding: '32px 0 18px 0',
        marginTop: 48,
        fontSize: '1.05rem',
        borderTop: '2px solid #e50914',
        boxShadow: '0 -2px 24px #000a',
      }}>
        <div style={{ marginBottom: 8 }}>
          &copy; {new Date().getFullYear()} <span style={{ color: '#e50914', fontWeight: 700 }}>The Movie Database</span>. All rights reserved.
        </div>
        <div style={{ color: '#b3b3b3', fontSize: '0.95rem', maxWidth: 600, margin: '0 auto' }}>
          This product uses the TMDB API but is not endorsed or certified by TMDB or Netflix. All movie data & images © their respective owners.
        </div>
      </footer>
    </div>
  );
}

export default App;
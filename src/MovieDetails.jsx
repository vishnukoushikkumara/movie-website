import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovieDetails, getStreamingPlatforms } from './tmdb';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [related, setRelated] = useState([]);
  const [showAllRelated, setShowAllRelated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetails(id);
        const platformData = await getStreamingPlatforms(id);
        if (movieData) {
          setMovie(movieData);
          setPlatforms(platformData);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Error loading movie details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    // Fetch related movies by genre from TMDB, fallback to similar if no genre match
    const fetchRelatedMovies = async () => {
      if (!movie) return;
      try {
        const API_KEY = process.env.REACT_APP_TMDB_KEY;
        const BASE_URL = 'https://api.themoviedb.org/3';
        const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
        let results = [];
        let foundGenre = false;
        if (movie.Genre) {
          // Get TMDB genre list
          const genreListRes = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: { api_key: API_KEY },
          });
          const genreNames = movie.Genre.split(',').map(g => g.trim().toLowerCase());
          // Try to match any genre
          let matchedGenre = null;
          for (const g of genreNames) {
            matchedGenre = genreListRes.data.genres.find(tmdbGenre => tmdbGenre.name.toLowerCase() === g);
            if (matchedGenre) break;
          }
          if (matchedGenre) {
            foundGenre = true;
            // Fetch movies by genre
            const res = await axios.get(`${BASE_URL}/discover/movie`, {
              params: {
                api_key: API_KEY,
                with_genres: matchedGenre.id,
                page: 1,
                sort_by: 'popularity.desc',
              },
            });
            results = res.data.results
              .filter(m => m.id !== parseInt(id))
              .map(movie => ({
                id: movie.id,
                Title: movie.title,
                Poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'N/A',
                Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
              }));
          }
        }
        // Fallback: if no genre match or no results, use /similar
        if (!foundGenre || results.length === 0) {
          const res = await axios.get(`${BASE_URL}/movie/${id}/similar`, {
            params: { api_key: API_KEY, page: 1 },
          });
          results = res.data.results
            .filter(m => m.id !== parseInt(id))
            .map(movie => ({
              id: movie.id,
              Title: movie.title,
              Poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'N/A',
              Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            }));
        }
        setRelated(results);
      } catch (err) {
        setRelated([]);
      }
    };
    fetchRelatedMovies();
  }, [movie, id]);

  if (loading) return <div className="App"><p>Loading...</p></div>;
  if (error) return <div className="App"><p className="error-text">{error}</p></div>;
  if (!movie) return <div className="App"><p>Movie not found</p></div>;

  return (
    <div className="App" style={{ padding: '20px', background: 'none', color: '#fff', minHeight: '100vh' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      <h2 style={{ color: '#fff', textShadow: '2px 2px 12px #000a', fontSize: '2.5rem', fontWeight: 900, margin: '32px 0 8px 0', letterSpacing: 2, textAlign: 'center' }}>
        {movie.Title} <span style={{ color: '#e50914', fontWeight: 700 }}>({movie.Year})</span>
      </h2>

      {movie.tagline && (
        <p style={{ fontStyle: 'italic', color: '#e50914', marginBottom: '24px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 500 }}>
          "{movie.tagline}"
        </p>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '32px',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#181818',
        borderRadius: '18px',
        boxShadow: '0 8px 32px #000a',
        padding: '36px 0',
        maxWidth: '1100px',
        margin: 'auto',
      }}>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.Title}
          style={{ width: '320px', borderRadius: '12px', boxShadow: '0 2px 12px #000a', background: '#111', margin: '0 0 0 24px' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />

        <div style={{ textAlign: 'left', maxWidth: '600px', flex: '1', minWidth: '300px', color: '#fff', padding: '0 24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
              <span style={{ color: '#fff' }}>Rating:</span> <span style={{ color: '#ffd700' }}>⭐ {movie.imdbRating}/10</span> <span style={{ color: '#b3b3b3' }}>({movie.imdbVotes} votes)</span>
            </p>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Runtime:</span> {movie.Runtime}</p>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Genre:</span> {movie.Genre}</p>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Release Date:</span> {movie.Released}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#fff', fontWeight: 700 }}>Plot:</p>
            <p style={{ lineHeight: '1.6', color: '#b3b3b3', fontSize: '1.05rem' }}>{movie.Plot}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Director:</span> {movie.Director}</p>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Cast:</span> {movie.Actors}</p>
            {movie.Writer !== 'N/A' && <p><span style={{ color: '#fff', fontWeight: 700 }}>Writer:</span> {movie.Writer}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Language:</span> {movie.Language}</p>
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Country:</span> {movie.Country}</p>
            {movie.Production !== 'N/A' && <p><span style={{ color: '#fff', fontWeight: 700 }}>Production:</span> {movie.Production}</p>}
          </div>

          {platforms.length > 0 && (
            <p style={{ marginBottom: '20px', color: '#e50914' }}>
              <strong>Available On:</strong> {platforms.join(', ')}
            </p>
          )}

          {movie.BoxOffice !== 'N/A' && (
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Box Office:</span> {movie.BoxOffice}</p>
          )}

          {movie.budget > 0 && (
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Budget:</span> ${movie.budget.toLocaleString()}</p>
          )}

          {movie.Website !== 'N/A' && (
            <p><span style={{ color: '#fff', fontWeight: 700 }}>Website:</span> <a href={movie.Website} target="_blank" rel="noopener noreferrer" style={{ color: '#e50914' }}>Official Site</a></p>
          )}
        </div>
      </div>

      {/* Related Movies Section */}
      {related.length > 0 && (
        <div style={{ margin: '48px auto 0 auto', maxWidth: '1200px' }}>
          <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 18px 12px', letterSpacing: 2, textAlign: 'left', textShadow: '2px 2px 12px #000a', textTransform: 'uppercase' }}>
            Related Movies
          </div>
          <div style={{ display: 'flex', gap: '22px', overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin', scrollbarColor: '#e50914 #232526' }}>
            {(showAllRelated ? related : related.slice(0, 8)).map((rel) => (
              <Link to={`/movie/${rel.id}`} key={rel.id} style={{ minWidth: 200, maxWidth: 220, background: '#181818', borderRadius: 10, boxShadow: '0 2px 12px #000a', color: '#fff', textDecoration: 'none', overflow: 'hidden', border: '1.5px solid transparent', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s, box-shadow 0.2s' }}>
                <img
                  src={rel.Poster !== 'N/A' ? rel.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={rel.Title}
                  style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: '8px 8px 0 0', background: '#111', transition: 'transform 0.2s' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                />
                <h4 style={{ margin: '10px 12px 6px 12px', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{rel.Title}</h4>
                <p style={{ margin: '0 12px 12px 12px', color: '#b3b3b3', fontSize: '0.95em' }}>{rel.Year}</p>
              </Link>
            ))}
            {related.length > 8 && !showAllRelated && (
              <button onClick={() => setShowAllRelated(true)} style={{ minWidth: 120, background: '#e50914', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', margin: 'auto 0', padding: '12px 18px', boxShadow: '0 2px 12px #000a', transition: 'background 0.2s' }}>See More</button>
            )}
          </div>
        </div>
      )}

      {movie.backdrop_path && (
        <div style={{ marginTop: '30px' }}>
          <img
            src={movie.backdrop_path}
            alt={`${movie.Title} backdrop`}
            style={{
              width: '100%',
              maxWidth: '800px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px #000a',
              margin: 'auto',
              display: 'block',
              background: '#111',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default MovieDetails;

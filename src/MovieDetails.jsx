import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getStreamingPlatforms } from './tmdb';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="App"><p>Loading...</p></div>;
  if (error) return <div className="App"><p className="error-text">{error}</p></div>;
  if (!movie) return <div className="App"><p>Movie not found</p></div>;

  return (
    <div className="App" style={{ padding: '20px' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      <h2>{movie.Title} ({movie.Year})</h2>

      {movie.tagline && (
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '20px' }}>
          "{movie.tagline}"
        </p>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.Title}
          style={{ width: '300px', borderRadius: '10px' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />

        <div style={{ textAlign: 'left', maxWidth: '500px', flex: '1', minWidth: '300px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Rating:</strong> ⭐ {movie.imdbRating}/10 ({movie.imdbVotes} votes)</p>
            <p><strong>Runtime:</strong> {movie.Runtime}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Release Date:</strong> {movie.Released}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><strong>Plot:</strong></p>
            <p style={{ lineHeight: '1.6' }}>{movie.Plot}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Cast:</strong> {movie.Actors}</p>
            {movie.Writer !== 'N/A' && <p><strong>Writer:</strong> {movie.Writer}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><strong>Language:</strong> {movie.Language}</p>
            <p><strong>Country:</strong> {movie.Country}</p>
            {movie.Production !== 'N/A' && <p><strong>Production:</strong> {movie.Production}</p>}
          </div>

          {platforms.length > 0 && (
            <p style={{ marginBottom: '20px' }}>
              <strong>Available On:</strong> {platforms.join(', ')}
            </p>
          )}

          {movie.BoxOffice !== 'N/A' && (
            <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
          )}

          {movie.budget > 0 && (
            <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
          )}

          {movie.Website !== 'N/A' && (
            <p><strong>Website:</strong> <a href={movie.Website} target="_blank" rel="noopener noreferrer">Official Site</a></p>
          )}
        </div>
      </div>

      {movie.backdrop_path && (
        <div style={{ marginTop: '30px' }}>
          <img
            src={movie.backdrop_path}
            alt={`${movie.Title} backdrop`}
            style={{
              width: '100%',
              maxWidth: '800px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      )}
    </div>
  );
}
export default MovieDetails;

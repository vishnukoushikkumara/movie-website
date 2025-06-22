import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={movie.Title}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
        }}
      />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
      {movie.vote_average && (
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          ⭐ {movie.vote_average.toFixed(1)}/10
        </p>
      )}
    </Link>
  );
}

export default MovieCard;
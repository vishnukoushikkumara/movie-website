import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchMovies = async (query, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        page: page,
      },
    });

    return res.data.results.map(movie => ({
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
      tagline: movie.tagline || '',
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits,videos',
      },
    });

    const movie = res.data;

    return {
      imdbID: movie.id.toString(),
      Title: movie.title,
      Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      Rated: 'N/A',
      Released: movie.release_date || 'N/A',
      Runtime: movie.runtime ? `${movie.runtime} min` : 'N/A',
      Genre: movie.genres.map(g => g.name).join(', '),
      Director: movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A',
      Writer: movie.credits?.crew?.filter(person => person.job === 'Writer' || person.job === 'Screenplay')
        .map(person => person.name).join(', ') || 'N/A',
      Actors: movie.credits?.cast?.slice(0, 4).map(actor => actor.name).join(', ') || 'N/A',
      Plot: movie.overview || 'No plot available',
      Language: movie.original_language?.toUpperCase() || 'N/A',
      Country: movie.production_countries?.map(c => c.name).join(', ') || 'N/A',
      Awards: 'N/A',
      Poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'N/A',
      Ratings: [
        {
          Source: 'TMDB',
          Value: `${movie.vote_average}/10`
        }
      ],
      Metascore: 'N/A',
      imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      imdbVotes: movie.vote_count ? movie.vote_count.toLocaleString() : 'N/A',
      Type: 'movie',
      DVD: 'N/A',
      BoxOffice: movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A',
      Production: movie.production_companies?.map(c => c.name).join(', ') || 'N/A',
      Website: movie.homepage || 'N/A',
      Response: 'True',
      backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      popularity: movie.popularity,
      adult: movie.adult,
      budget: movie.budget,
      revenue: movie.revenue,
      status: movie.status,
      tagline: movie.tagline,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getStreamingPlatforms = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}/watch/providers`, {
      params: {
        api_key: API_KEY,
      },
    });
    const platforms = res.data.results?.IN?.flatrate || [];
    return platforms.map(p => p.provider_name);
  } catch (error) {
    console.error("Error fetching streaming platforms:", error);
    return [];
  }
};

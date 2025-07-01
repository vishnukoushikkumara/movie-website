# The Movie Database (Netflix-Inspired React App)

A modern, Netflix-inspired movie discovery web app built with React. Browse trending, top-rated, and now-playing movies, search for any title, and view rich details and related suggestions—all in a cinematic, dark-themed UI.


**Note:** The deployed app at [https://vishnukoushikkumara.github.io/movie-website](https://vishnukoushikkumara.github.io/movie-website) may not work in some regions due to restrictions from the TMDB API. If you experience issues with the site not loading or showing no data, please try accessing it using a VPN set to a supported region (such as the US or Europe). Thank you for your understanding!

---

## 🚀 Features

- **Netflix-Style UI:**
  - Dark, immersive theme with bold branding and smooth animations.
  - Hero banner, horizontal movie rows (Trending Now, Top Rated, Now Playing), and a modern search experience.
- **Dynamic Movie Discovery:**
  - Browse trending, top-rated, and now-playing movies from TMDB.
  - Live search for any movie title.
  - Rich movie details page with cast, plot, ratings, and more.
  - Related movies suggested by genre or similarity.
- **Robust Error Handling:**
  - Handles missing images, API errors, and empty results gracefully.
- **Responsive Design:**
  - Looks great on desktop and mobile.
- **No UI Dependencies:**
  - All carousels and rows are built with pure CSS and React.

---

## 🖼️ UI Preview

A dedicated `screenshots/` folder has been added to this repository containing 7 images (`sc1.png`, `sc2.png`, ..., `sc7.png`) that showcase the user interface and key features of the website. Feel free to browse them for a visual reference of the project.

---

## 🌐 API Integration

- Uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) for all movie data, images, and genres.
- Integrates with multiple TMDB endpoints:
  - `/trending/movie/day`, `/movie/top_rated`, `/movie/now_playing`, `/search/movie`, `/movie/{id}`, `/movie/{id}/similar`, `/genre/movie/list`, `/discover/movie`
- **Note:** You need a TMDB API key. Set it as `REACT_APP_TMDB_KEY` in your environment variables.

---

## 🌍 Regional API Access Note

> In some regions (such as India), the TMDB API may return limited data or fail to respond due to geographic restrictions.  
> If you encounter 401/403 errors or missing results during development, you may temporarily use a VPN set to a supported region (e.g., the US or Europe) to access full API functionality.  
> This workaround was used during development to ensure complete feature availability.

---

## 🛠️ How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vishnukoushikkumara/movie-website.git
   cd movie-website
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set your TMDB API key:**
   - Create a `.env` file in the `movie` directory:
     ```env
     REACT_APP_TMDB_KEY=your_tmdb_api_key_here
     ```
4. **Start the development server:**
   ```bash
   npm start
   ```
5. **(If in India) Enable your VPN** and set it to a supported region before running the app.
6. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 📢 Disclaimer

- This product uses the TMDB API but is **not endorsed or certified by TMDB or Netflix**.
- All movie data & images © their respective owners.

---

## 🙏 Credits

- [TMDB API](https://www.themoviedb.org/documentation/api)
- Netflix for UI inspiration
- Built with React 

---

## Author
- Kumara Vishnu Koushik
- [My GitHub Profile](https://github.com/vishnukoushikkumara)

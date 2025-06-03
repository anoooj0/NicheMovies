let titleInput = document.getElementById("movieInput")
let body = document.querySelector("body")
let movieResultDiv = document.querySelector(".results");
let movieTitle = document.querySelector("#movieTitle")
let releaseDate = document.querySelector("#releaseDate")
let overview = document.querySelector("#overview")
let runtime = document.querySelector("#runtime")
let rating = document.querySelector("#rating")
let rated = document.querySelector("#rated") 
let image = document.querySelector("#moviePoster")
let reviewsList = document.querySelector("#reviewsList")

let button = document.getElementById("submit")
let clearButton = document.getElementById("clear")

// Navigation elements
let searchTab = document.getElementById("searchTab")
let genresTab = document.getElementById("genresTab")
let searchSection = document.getElementById("searchSection")
let genresSection = document.getElementById("genresSection")
let genresList = document.getElementById("genresList")
let genreMovies = document.getElementById("genreMovies")

const apiKey = "d5e22ead8fdd7c8a711d9808d12c9629";

// Load recent movies on page load
document.addEventListener('DOMContentLoaded', function() {
  loadRecentMovies();
});

// Load recent movies for carousel
function loadRecentMovies() {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=1`)
    .then(response => response.json())
    .then(data => {
      const moviesTrack = document.getElementById('moviesTrack');
      moviesTrack.innerHTML = '';
      
      // Create two sets for seamless loop
      const movies = data.results.slice(0, 10);
      const allMovies = [...movies, ...movies];
      
      allMovies.forEach(movie => {
        const movieImg = document.createElement('img');
        movieImg.className = 'carousel-movie';
        movieImg.src = movie.poster_path ? 
          `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
          'https://via.placeholder.com/200x300?text=No+Image';
        movieImg.alt = movie.title;
        movieImg.title = movie.title;
        movieImg.addEventListener('click', () => loadMovieDetails(movie.id));
        moviesTrack.appendChild(movieImg);
      });
    })
    .catch(error => console.error('Error loading recent movies:', error));
}

// Navigation functionality
searchTab.addEventListener("click", function() {
  searchTab.classList.add("active");
  genresTab.classList.remove("active");
  searchSection.style.display = "block";
  genresSection.style.display = "none";
});

genresTab.addEventListener("click", function() {
  genresTab.classList.add("active");
  searchTab.classList.remove("active");
  searchSection.style.display = "none";
  genresSection.style.display = "block";
  loadGenres();
});

// Load genres from TMDB
function loadGenres() {
  if (genresList.innerHTML === "") {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        genresList.innerHTML = "";
        data.genres.forEach(genre => {
          const genreCard = document.createElement("div");
          genreCard.className = "genre-card";
          genreCard.textContent = genre.name;
          genreCard.addEventListener("click", () => loadMoviesByGenre(genre.id, genre.name));
          genresList.appendChild(genreCard);
        });
      })
      .catch(error => console.error('Error loading genres:', error));
  }
}

// Load movies by genre
function loadMoviesByGenre(genreId, genreName) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc`)
    .then(response => response.json())
    .then(data => {
      genreMovies.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center; color: #BB86FC; margin-bottom: 2rem;">${genreName} Movies</h3>`;
      data.results.slice(0, 12).forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.className = "genre-movie-card";
        movieCard.innerHTML = `
          <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}">
          <div class="genre-movie-info">
            <h4>${movie.title}</h4>
            <p>Rating: ${movie.vote_average}/10</p>
            <p>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
          </div>
        `;
        movieCard.addEventListener("click", () => loadMovieDetails(movie.id));
        genreMovies.appendChild(movieCard);
      });
    })
    .catch(error => console.error('Error loading movies by genre:', error));
}

// Load movie details and switch to search view
function loadMovieDetails(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayMovieDetails(data);
      loadReviews(movieId);
      // Switch to search tab to show results
      searchTab.classList.add("active");
      genresTab.classList.remove("active");
      searchSection.style.display = "block";
      genresSection.style.display = "none";
    })
    .catch(error => console.error('Error loading movie details:', error));
}

// Display movie details
function displayMovieDetails(data) {
  movieTitle.innerHTML = data.title;
  image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "";
  releaseDate.innerHTML = "Release Date: " + data.release_date;
  overview.innerHTML = "Plot: " + data.overview;
  runtime.innerHTML = "Runtime: " + (data.runtime ? data.runtime + " minutes" : "N/A");
  rating.innerHTML = "TMDB Rating: " + data.vote_average + "/10";
  rated.innerHTML = "Content Rating: " + (data.adult ? "R" : "PG");
}

// Load reviews
function loadReviews(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      reviewsList.innerHTML = "";
      if (data.results && data.results.length > 0) {
        data.results.slice(0, 3).forEach(review => {
          const reviewItem = document.createElement("div");
          reviewItem.className = "review-item";
          
          const content = review.content.length > 300 ? 
            review.content.substring(0, 300) + "..." : 
            review.content;
            
          reviewItem.innerHTML = `
            <div class="review-author">Review by ${review.author}</div>
            <div class="review-content">${content}</div>
            <div class="review-rating">${review.author_details.rating ? `Rating: ${review.author_details.rating}/10` : ''}</div>
          `;
          reviewsList.appendChild(reviewItem);
        });
      } else {
        reviewsList.innerHTML = "<p style='color: rgba(255, 255, 255, 0.7);'>No reviews available for this movie.</p>";
      }
    })
    .catch(error => {
      console.error('Error loading reviews:', error);
      reviewsList.innerHTML = "<p style='color: rgba(255, 255, 255, 0.7);'>Unable to load reviews.</p>";
    });
}

button.addEventListener("click", function() {
  userInput = titleInput.value;

  // First, search for the movie
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(userInput)}`)
    .then(response => response.json())
    .then(searchData => {
      console.log(searchData);
      if (searchData.results && searchData.results.length > 0) {
        const movieId = searchData.results[0].id;

        // Get detailed movie information
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            displayMovieDetails(data);
            loadReviews(movieId);
          })
          .catch(error => {
            console.error('Error fetching movie details:', error);
          });
      } else {
        movieTitle.innerHTML = "Movie not found";
        image.src = "";
        releaseDate.innerHTML = "";
        overview.innerHTML = "";
        runtime.innerHTML = "";
        rating.innerHTML = "";
        rated.innerHTML = "";
        reviewsList.innerHTML = "";
      }
    })
    .catch(error => {
      console.error('Error searching for movie:', error);
    });
})
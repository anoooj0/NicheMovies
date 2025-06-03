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





let button = document.getElementById("submit")

let clearButton = document.getElementById("clear")

button.addEventListener("click", function() {
  userInput = titleInput.value;
  const apiKey = "d5e22ead8fdd7c8a711d9808d12c9629"; // Replace with your actual TMDB API key

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
            movieTitle.innerHTML = data.title;
            image.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "";
            releaseDate.innerHTML = "Release Date: " + data.release_date;
            overview.innerHTML = "Plot: " + data.overview;
            runtime.innerHTML = "Runtime: " + (data.runtime ? data.runtime + " minutes" : "N/A");
            rating.innerHTML = "TMDB Rating: " + data.vote_average + "/10";
            rated.innerHTML = "Content Rating: " + (data.adult ? "R" : "PG");
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
      }
    })
    .catch(error => {
      console.error('Error searching for movie:', error);
    });
})
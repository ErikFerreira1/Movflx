function openSearch() {
  document.getElementById("myOverlay").style.display = "block";
}

function closeSearch() {
  document.getElementById("myOverlay").style.display = "none";
}
function toggleMenu() {
  const navLinks = document.querySelector(".navLinks");
  navLinks.classList.toggle("active");
}
document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "f7618a55c1d648cc00383ed3b123cffe";
  const genreSelect = document.getElementById("genre");
  const mainForm = document.getElementById("mainSearchForm");
  const highRatingButton = document.getElementById("highRating");
  const resultsDiv = document.getElementById("results");
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  let sortByRating = false;

  async function getGenres() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`
      );
      const data = await response.json();
      const genres = data.genres;
      genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao obter gêneros:", error);
    }
  }

  async function searchMovies(event) {
    event.preventDefault();
    mainForm.addEventListener("submit", searchMovies);

    mainForm.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        searchMovies(event);
      }
    });
    const genre = genreSelect.value;
    const minDuration = 60;
    const minRating = 7;
    const releaseYear = document.getElementById("releaseYear").value;
    let startYear = document.getElementById("startYear").value;
    let endYear = document.getElementById("endYear").value;

    if (genreSelect.value === "Gênero") {
      alert("Selecione um gênero");
      return;
    }

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&with_genres=${genre}&with_runtime.gte=${minDuration}`;

    if (startYear !== "" && startYear !== "null") {
      endYear = endYear !== "" && endYear !== "null" ? endYear : 2024;

      url += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
    } else if (endYear !== "" && endYear !== "null") {
      startYear = 1900;

      url += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
    } else if (releaseYear) {
      url += `&primary_release_year=${releaseYear}`;
    }

    if (sortByRating) {
      url += `&vote_average.gte=${minRating}`;
    }
    console.log(startYear, endYear);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const moviesWithDetails = await Promise.all(
        data.results.map(async (movie) => {
          const movieDetails = await getMovieDetails(movie.id);
          return { ...movie, runtime: movieDetails.runtime };
        })
      );
      const filteredMovies = moviesWithDetails.filter(
        (movie) => movie.runtime >= minDuration
      );
      const sortedMovies = filteredMovies.sort(
        (a, b) => b.vote_average - a.vote_average
      );

      displayResults(sortedMovies);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }

  async function getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao obter detalhes do filme:", error);
    }
  }

  function displayResults(movies) {
    resultsDiv.innerHTML = "";
    if (movies.length === 0) {
      resultsDiv.innerHTML = "<p>Nenhum filme encontrado.</p>";
    } else {
      movies.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        const posterPath = movie.poster_path
          ? imageBaseUrl + movie.poster_path
          : "../../assets/noimage.jpg";

        const movieLink = document.createElement("a");
        movieLink.href = `../Movie/movie.html?movieID=${movie.id}`;
        movieLink.innerHTML = `<img src="${posterPath}" alt="${movie.title} poster">`;

        const articleInfoMovie = document.createElement("div");
        articleInfoMovie.classList.add("articleInfoMovie");
        articleInfoMovie.innerHTML = `
          <div class="articleContainerMovie">
            <div class="articleInfoMovie">
              <div>
                <h3>${movie.title}</h3>
                <h3 class="score"><img src="../../assets/estrela.png"> ${movie.vote_average.toFixed(
                  2
                )}</h3>
              </div>
              <div>
                <h4 class="year">${new Date(
                  movie.release_date
                ).getFullYear()}</h4>
              </div>
            </div>
          </div>
        `;

        movieElement.appendChild(movieLink);
        movieElement.appendChild(articleInfoMovie);

        resultsDiv.appendChild(movieElement);
      });
    }
  }

  highRatingButton.addEventListener("click", function () {
    sortByRating = !sortByRating;
    if (sortByRating) {
      highRatingButton.classList.add("active");
    } else {
      highRatingButton.classList.remove("active");
    }
  });

  getGenres();
  mainForm.addEventListener("submit", searchMovies);

  function checkAuth() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const loginButton = document.getElementById("loginButton");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logout = document.getElementById("idlogoutButton");
    const favoritePage = document.getElementById("favoritePage");

    if (token && username) {
      loginButton.style.display = "none";
      usernameDisplay.innerText = "Olá, " + username;
      usernameDisplay.style.display = "block";
    } else {
      loginButton.style.display = "block";
      logout.style.display = "none";
      favoritePage.style.display = "none";
      usernameDisplay.style.display = "none";
    }
  }

  checkAuth();

  document
    .getElementById("idlogoutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      window.location.href = "../../index.html";
    });
  function clearFormFields() {
    document.getElementById("genre").selectedIndex = 0;
    document.getElementById("releaseYear").value = "";
    document.getElementById("startYear").value = "";
    document.getElementById("endYear").value = "";
    document.getElementById("highRating").classList.remove("active");
  }

  document
    .getElementById("clearButton")
    .addEventListener("click", clearFormFields);
});

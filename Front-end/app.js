function openSearch() {
  document.getElementById("myOverlay").style.display = "block";
}
function closeSearch() {
  document.getElementById("myOverlay").style.display = "none";
}
function toggleMenu() {
  const navLinks = document.querySelector('.navLinks');
  navLinks.classList.toggle('active');
}
document.addEventListener("DOMContentLoaded", function () {
  function checkAuth() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const loginButton = document.getElementById("loginButton");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logout = document.getElementById("idlogoutButton");

    if (token && username) {
      loginButton.style.display = "none";
      usernameDisplay.innerText = "Olá, " + username;
      usernameDisplay.style.display = "block";
    } else {
      loginButton.style.display = "block";
      logout.style.display = "none";
      usernameDisplay.style.display = "none";
    }
  }

  checkAuth();

  async function fetchTopRatedMovies() {
    const apiKey = "f7618a55c1d648cc00383ed3b123cffe";
    const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=pt-BR&page=1`;

    const response = await fetch(topRatedUrl);
    const data = await response.json();

    return data.results;
  }

  async function fetchPopularMovies() {
    const apiKey = "f7618a55c1d648cc00383ed3b123cffe";
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;

    const response = await fetch(popularUrl);
    const data = await response.json();

    return data.results;
  }

  async function displayMovies(containerId, movies) {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    for (const movie of movies) {
      const articleContainerMovie = document.createElement("div");
      articleContainerMovie.classList.add("articleContainerMovie");

      const linkImgMovie = document.createElement("a");
      linkImgMovie.onclick = function () {
        sessionStorage.setItem("movieID", movie.id);
        window.location.href = "components/Movie/movie.html";
      };

      const imagemFilme = document.createElement("img");
      imagemFilme.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      imagemFilme.alt = "posterMovie";
      linkImgMovie.appendChild(imagemFilme);

      const articleInfoMovie = document.createElement("div");
      articleInfoMovie.classList.add("articleInfoMovie");

      const titleContainer = document.createElement("div");
      const title = document.createElement("h3");
      title.innerText = movie.title;
      titleContainer.appendChild(title);

      const ratingContainer = document.createElement("div");
      const rating = document.createElement("h3");

      const starImg = document.createElement("img");
      starImg.src = "assets/estrela.png";
      starImg.alt = "Estrela";

      rating.appendChild(starImg);
      rating.appendChild(document.createTextNode(" "));
      rating.appendChild(
        document.createTextNode(parseFloat(movie.vote_average).toFixed(2))
      );

      const detailsContainer = document.createElement("div");

      const year = document.createElement("h4");
      year.innerText = movie.release_date.substring(0, 4);

      detailsContainer.appendChild(year);
      titleContainer.appendChild(rating);
      titleContainer.appendChild(ratingContainer);
      articleInfoMovie.appendChild(titleContainer);
      articleInfoMovie.appendChild(detailsContainer);

      articleContainerMovie.appendChild(linkImgMovie);
      articleContainerMovie.appendChild(articleInfoMovie);

      container.appendChild(articleContainerMovie);
    }
  }

  fetchTopRatedMovies().then((topRatedMovies) => {
    displayMovies("topRatedMovies", topRatedMovies);
  });

  fetchPopularMovies().then((popularMovies) => {
    displayMovies("popularMovies", popularMovies);
  });

  document
    .getElementById("idlogoutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      window.location.href = "index.html";
    });
});

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
document.addEventListener("DOMContentLoaded", async function () {
  const favoritesContainer = document.getElementById("favorites-container");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const userId = getUserIdFromToken(token);

  async function fetchFavoriteMovies() {
    try {
      const response = await fetch(
        `https://movflx-0b1dabd910cf.herokuapp.com/favorites/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar favoritos");
      }

      const data = await response.json();
      const favorites = data.favorites.filter((movieId) => movieId !== null);

      for (const movieId of favorites) {
        const movieData = await fetchMovieData(movieId);
        displayFavoriteMovie(movieData, movieId);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes favoritos:", error);
    }
  }

  function getUserIdFromToken(token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.id;
  }

  async function fetchMovieData(movieId) {
    const apiKey = "f7618a55c1d648cc00383ed3b123cffe";
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar dados do filme");
    }

    return await response.json();
  }

  function displayFavoriteMovie(movieData, movieId) {
    const movieElement = document.createElement("div");
    movieElement.classList.add("favorite-item");

    movieElement.innerHTML = `
      
        <a href="../Movie/movie.html?movieID=${movieId}">
          <img id="imageMovie" src="https://image.tmdb.org/t/p/w500/${
            movieData.poster_path
          }" alt="${movieData.title}">
        </a>
        <div class="articleInfoMovie">
        <div class="articleContainerMovie">
          <div class="articleInfoMovie">
            <div class="articleInfoMovie-ch">
              <h3>${movieData.title}</h3>
              <p>${new Date(movieData.release_date).getFullYear()}</p>
            </div>
          <div>
              <button class="remove-favorite" data-movie-id="${movieId}"><img src="../../assets/delete.png"></button>
          </div>
        </div>
        </div>
    </div>
    `;
    favoritesContainer.appendChild(movieElement);

    movieElement
      .querySelector(".remove-favorite")
      .addEventListener("click", async function () {
        await removeFavoriteMovie(movieId);
        movieElement.remove();
      });
  }

  async function removeFavoriteMovie(movieId) {
    try {
      const response = await fetch(
        `https://movflx-0b1dabd910cf.herokuapp.com/favorites/remove/${userId}/${movieId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover favorito");
      }

      const data = await response.json();
    
    } catch (error) {
      console.error("Erro ao remover filme dos favoritos:", error);
    }
  }

  fetchFavoriteMovies();

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
});

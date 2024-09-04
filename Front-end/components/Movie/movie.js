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
  const favoriteButton = document.getElementById("favoriteButton");
  const favoriteIcon = document.getElementById("favoritesIcon");
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movieID");
  const token = localStorage.getItem("token");
  const userId = token;

  async function checkFavoriteStatus() {
    try {
      const response = await fetch(
        `https://movflx-0b1dabd910cf.herokuapp.com/favorites/check/${userId}/${movieId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
        
      );
      const data = await response.json();
      if (data.isFavorite) {
        favoriteIcon.src = "../../assets/coracaoCheio.png";
      } else {
        favoriteIcon.src = "../../assets/coracaoVazio.png";
      }
    } catch (error) {
      console.error("Erro ao verificar status do favorito:", error);
    }
  }

  if (movieId && userId) {
    checkFavoriteStatus();
  }

  favoriteButton.addEventListener("click", async function () {
    if (!userId) {
      window.location.href = "../Login/login.html";
    }

    try {
      let response;
      if (favoriteIcon.src.includes("coracaoVazio.png")) {
        response = await fetch("https://movflx-0b1dabd910cf.herokuapp.com/favorites/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, movieId }),
        });
      } else {
        response = await fetch(
          `https://movflx-0b1dabd910cf.herokuapp.com/favorites/remove/${userId}/${movieId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const data = await response.json();
      if (response.ok) {
        if (favoriteIcon.src.includes("coracaoVazio.png")) {
          favoriteIcon.src = "../../assets/coracaoCheio.png";
        } else {
          favoriteIcon.src = "../../assets/coracaoVazio.png";
        }
      } else {
        console.error("Erro ao atualizar favoritos:", data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar filme aos favoritos:", error);
    }
  });

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

  document.getElementById("idlogoutButton").addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "../../index.html";
  });

  if (movieId) {
    try {
      const apiKey = "f7618a55c1d648cc00383ed3b123cffe";
      const searchUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;

      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error("Erro ao carregar dados!");
      }

      const searchData = await searchResponse.json();

      const banner = document.getElementById("mainBannerIntro");
      banner.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${searchData.backdrop_path}')`;

      const posterMovie = document.querySelector(".posterMovie");
      const poster = document.createElement("img");

      poster.src = searchData.poster_path
        ? `https://image.tmdb.org/t/p/w500/${searchData.poster_path}`
        : "../../assets/noimage.jpg";
      posterMovie.appendChild(poster);

      const movieTitle = document.getElementById("titleMovie-ch");
      movieTitle.innerText = searchData.title;

      const movieSynopsis = document.getElementById("movieSynopsis-ch");
      movieSynopsis.innerText = searchData.overview;

      const genrer = document.getElementById("genrer");
      genrer.innerHTML = "";

      if (searchData.genres && searchData.genres.length > 0) {
        const genresList = searchData.genres.map((genre) => genre.name);
        genrer.innerText = genresList.join(", ");
      } else {
        genrer.innerText = "Gênero não disponível";
      }

      const rating = document.getElementById("rating");
      const imgStar = document.createElement("img");
      imgStar.src = "../../assets/estrela.png";

      rating.appendChild(imgStar);
      rating.appendChild(document.createTextNode(" "));
      rating.appendChild(
        document.createTextNode(parseFloat(searchData.vote_average).toFixed(2))
      );

      const time = document.getElementById("time");
      time.innerText = searchData.runtime + " MIN";

      const release = document.getElementById("release");
      if (searchData.release_date) {
        const releaseDate = new Date(searchData.release_date);
        const formattedReleaseDate = releaseDate.toLocaleDateString("pt-BR");
        release.innerText = formattedReleaseDate;
      } else {
        release.innerText = "Data de lançamento não disponível";
      }
    } catch (error) {
      console.error("Ocorreu um erro", error);
    }
  } else {
    console.error("O ID do filme não foi encontrado.");
  }
});

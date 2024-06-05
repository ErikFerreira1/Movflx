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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return "";
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

document.addEventListener("DOMContentLoaded", function () {
  async function search() {
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




    const searchQuery = getParameterByName("search");
    const infos = document.getElementById("infos");

    infos.innerHTML = "";

    try {
      const apiKey = "f7618a55c1d648cc00383ed3b123cffe";
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&include_adult=false`;

      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error("Erro ao carregar dados!");
      }

      const searchData = await searchResponse.json();

      if (searchData.results.length === 0) {
        alert("Nenhum resultado encontrado!");
        return;
      }

      for (const filme of searchData.results) {
        const movieUrl = `https://api.themoviedb.org/3/movie/${filme.id}?api_key=${apiKey}&language=pt-BR`;
        const movieResponse = await fetch(movieUrl);

        if (!movieResponse.ok) {
          throw new Error("Erro ao carregar dados do filme!");
        }

        const movieData = await movieResponse.json();
     
        const articleContainer = document.createElement("div");
        articleContainer.classList.add("articleContainer");

        const articleContainerMovie = document.createElement("div");
        articleContainerMovie.classList.add("articleContainerMovie");

        const linkImgMovie = document.createElement("a");
        linkImgMovie.onclick = function () {
          sessionStorage.setItem("movieID", movieData.id);
          window.location.href = "../Movie/movie.html";
        };

        const imagemFilme = document.createElement("img");
        imagemFilme.src = movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`
          : "../../assets/noimage.jpg";
        imagemFilme.alt = "posterMovie";
        linkImgMovie.appendChild(imagemFilme);

        const articleInfoMovie = document.createElement("div");
        articleInfoMovie.classList.add("articleInfoMovie");

        const titleContainer = document.createElement("div");
        const title = document.createElement("h3");
        title.innerText = movieData.title;
        titleContainer.appendChild(title);

        const ratingContainer = document.createElement("div");
        const rating = document.createElement("h1");

        const starImage = document.createElement("img");
        starImage.src = "../../assets/estrela.png";
        starImage.alt = "Estrela";
        rating.appendChild(starImage);
        rating.appendChild(
          document.createTextNode(parseFloat(movieData.vote_average).toFixed(2))
        );

        const detailsContainer = document.createElement("div");

        const year = document.createElement("h4");
        year.innerText = movieData.release_date.substring(0, 4);

        detailsContainer.appendChild(year);

        titleContainer.appendChild(rating);
        titleContainer.appendChild(ratingContainer);
        articleInfoMovie.appendChild(titleContainer);
        articleInfoMovie.appendChild(detailsContainer);

        articleContainerMovie.appendChild(linkImgMovie);
        articleContainerMovie.appendChild(articleInfoMovie);

        articleContainer.appendChild(articleContainerMovie);

        infos.appendChild(articleContainer);
      }
    } catch (error) {
      console.error("Ocorreu um erro", error);
    }
  }
    document
    .getElementById("idlogoutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      window.location.href = "../../index.html";
    });

  search();
});

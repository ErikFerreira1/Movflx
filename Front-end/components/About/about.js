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

  document
    .getElementById("idlogoutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      window.location.href = "../../index.html";
    });
});

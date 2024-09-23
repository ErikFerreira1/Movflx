document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("token")) {
    window.location.href = "../../index.html";
  }

  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("https://movflx.onrender.com/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();

        if (response.ok) {
          window.location.href = "../Login/login.html";
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Estamos com problemas na hospedagem. Será resolvido em breve.");
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (localStorage.getItem("token")) {
      window.location.href = "../../index.html";
    }
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch("https://www.movflx.fun/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          window.location.href = "../../index.html";
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Estamos com problemas na hospedagem. Será resolvido em breve.");
      }
    });
  });
});
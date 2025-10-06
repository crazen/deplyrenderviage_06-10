document.getElementById("forgotForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value.trim();

  if (!email) {
    alert("Digite seu email!");
    return;
  }

  try {
    // Certifique-se de que o backend está rodando na porta 3001
    const response = await fetch("http://localhost:3000/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      // Salva email para usar na próxima página (opcional)
      localStorage.setItem('emailReset', email);
      // Redireciona para a página de confirmação
      window.location.href = "confirmacao-esqueceu-senha.html";
    } else {
      // Mostra a mensagem de erro do backend
      alert(data.error || "Erro ao enviar email");
    }
  } catch (err) {
    console.error("Erro ao conectar com o servidor:", err);
    alert("Erro ao conectar com o servidor!");
  }
});

// Botão de cancelar volta para login
document.getElementById("cancelBtn").addEventListener("click", function() {
  window.location.href = "login.html";
});

document.getElementById("cadastroForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let nome = document.getElementById("nome").value.trim();
    let sobrenome = document.getElementById("sobrenome").value.trim();
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value;
    let confirmarSenha = document.getElementById("confirmarSenha").value;
    let erro = document.getElementById("erro");
    erro.textContent = "";
    erro.style.color = "red";

    if (!nome || !sobrenome || !email || !senha || !confirmarSenha) {
        erro.textContent = "Todos os campos são obrigatórios.";
        return;
    }

    if (senha !== confirmarSenha) {
        erro.textContent = "As senhas não coincidem.";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sobrenome, email, senha })
        });

        const result = await response.json();

        if (response.ok) {
            erro.textContent = result.message;
            erro.style.color = "green";
            document.getElementById("cadastroForm").reset();
        } else {
            erro.textContent = result.error;
        }
    } catch (err) {
        erro.textContent = "Erro ao conectar com o servidor.";
    }
});

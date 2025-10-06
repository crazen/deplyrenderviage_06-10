document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  function showMessage(msg, color = 'red') {
    let el = document.getElementById('msgLogin');
    if (!el) {
      el = document.createElement('p');
      el.id = 'msgLogin';
      el.style.fontWeight = '600';
      el.style.marginTop = '10px';
      document.getElementById('loginForm').appendChild(el);
    }
    el.textContent = msg;
    el.style.color = color;
  }

  if (!email || !password) {
    showMessage('Preencha todos os campos!', 'red');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message, 'green');
      console.log('Usuário logado:', data.user);

      if (data.user.primeiroLogin) {
        window.location.href = 'boasvindas1.html';
      } else {
        window.location.href = 'boasvindas1.html'; // alterar para a tela principal qnd tiver pronta
      }
    } else {
        showMessage(data.error || 'Email ou senha incorretos', 'red');
    }

  } catch (err) {
    console.error(err);
    showMessage('Erro ao conectar com o servidor!', 'red');
  }
});
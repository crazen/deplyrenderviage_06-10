
import { obterDestinoOrquestrado } from './dataApi.js'


// Elementos do modal e overlay
const elementosUI = {
  sobreposicao: document.querySelector("[data-overlay]"),
  modal: document.querySelector("[data-modal]"),
  imagem: document.getElementById("popup-image"),
  nome: document.getElementById("destination-name"),
  botaoFechar: document.querySelector("[data-close]"),
  botaoDepois: document.querySelector("[data-later]"),
  botaoIniciar: document.querySelector("[data-start]")
};


// Abre modal
function abrirModal() {
  elementosUI.sobreposicao.hidden = false;
  elementosUI.modal.hidden = false;
  document.documentElement.style.overflow = "hidden";
  elementosUI.botaoIniciar?.focus();
}

// Fecha modal
function fecharModal() {
  elementosUI.sobreposicao.hidden = true;
  elementosUI.modal.hidden = true;
  document.documentElement.style.overflow = "";
}

// Fecha com ESC
function aoPressionarTecla(e) {
  if (e.key === "Escape") fecharModal();
}

// Fecha ao clicar fora
function aoClicarSobreposicao(e) {
  if (e.target === elementosUI.sobreposicao) fecharModal();
}

// Inicializa preenchendo os dados e ligando eventos
async function inicializar() {
  const destino = await obterDestinoOrquestrado();
  if (elementosUI.nome) elementosUI.nome.textContent = destino.nome || "Seu Destino";
  if (elementosUI.imagem) {
    elementosUI.imagem.src = destino.imagem || "";
    elementosUI.imagem.alt = destino.nome ? `Imagem de ${destino.nome}` : "Imagem do destino";
  }

  document.addEventListener("keydown", aoPressionarTecla);
  elementosUI.sobreposicao.addEventListener("click", aoClicarSobreposicao);
  elementosUI.botaoFechar?.addEventListener("click", fecharModal);
  elementosUI.botaoDepois?.addEventListener("click", fecharModal);

  elementosUI.botaoIniciar?.addEventListener("click", () => {
    const params = new URLSearchParams();
    if (destino.viagemId != null) params.set("viagemId", destino.id);
    else params.set("nome", destino.nome || "destino");
    window.location.href = `/questionario.html?${params.toString()}`;
  });

  abrirModal();
}

document.addEventListener("DOMContentLoaded", inicializar);

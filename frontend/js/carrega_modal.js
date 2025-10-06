console.log('moldal carregado'); // deve aparecer no console

// ./frontend/js/modal-integrado.js
console.log('modal-integrado carregado');

const OPEN_BTN_SELECTORS = ['#btn-open-modal', '#btn-nova-viagem', '#btn-abrir'];
const MODAL_HTML_URL = './modal_criar_viagem.html';     // ajuste caso esteja em outra pasta
const OVERLAY_SELECTOR = '#popupOverlay';               // id dentro do HTML do modal

let overlayEl = null;
let initialized = false;

function qs(root, sel) { return (root || document).querySelector(sel); }

function openModal() {
  if (!overlayEl) return;
  overlayEl.classList.add('active');               // seu CSS usa .popup-overlay.active { display:flex }
  overlayEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // foco inicial (acessibilidade)
  const first = overlayEl.querySelector('.create-btn, button, [href], input, textarea, select');
  first?.focus();
}

function closeModal() {
  if (!overlayEl) return;
  overlayEl.classList.remove('active');
  overlayEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindModalEvents() {
  if (!overlayEl || initialized) return;

  const btnFechar   = qs(overlayEl, '[data-close]');
  const btnCriar    = qs(overlayEl, '#btn-criar-nova');
  const btnColar    = qs(overlayEl, '#enablePaste');
  const btnConfirm  = qs(overlayEl, '#confirmBtn');
  const inputLink   = qs(overlayEl, '#linkInput');

  // fechar no X
  btnFechar?.addEventListener('click', closeModal);

  // fechar clicando no backdrop
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) closeModal();
  });

  // ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayEl.classList.contains('active')) closeModal();
  });

  // Criar nova viagem (ajuste a URL se necessário)
  btnCriar?.addEventListener('click', () => {
    window.location.href = '../frontend/criar-viagem.html';
    closeModal();
  });

  // Mostrar botão confirmar quando digitar algo
  inputLink?.addEventListener('input', () => btnConfirm?.classList.add('show'));

  // Colar do clipboard
  btnColar?.addEventListener('click', async () => {
    try {
      inputLink?.focus();
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && inputLink) {
          inputLink.value = text;
          btnConfirm?.classList.add('show');
        }
      }
    } catch (err) {
      console.warn('Não foi possível ler a área de transferência:', err);
      alert('Não consegui colar automaticamente. Use Ctrl+V.');
    }
  });

  // Confirmar link (troque o comportamento conforme sua regra)
  btnConfirm?.addEventListener('click', () => {
    const link = (inputLink?.value || '').trim();
    if (!link) return alert('Cole um link válido.');
    alert('Link recebido: ' + link);
    // Ex.: window.location.href = link;
    closeModal();
  });

  initialized = true;
}

// carrega o HTML do modal (uma vez) e inicializa
async function ensureModalLoaded() {
  if (overlayEl?.isConnected) return;

  const html = await fetch("./frontend/modal_criar_viagem.html").then(r => r.text());
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  // Se o arquivo de modal for uma página completa, pegue o nó pelo id.
  // Se for só o trecho, o parser ainda vai encontrar normalmente.
  overlayEl = doc.querySelector(OVERLAY_SELECTOR);
  if (!overlayEl) {
    throw new Error('Não encontrei #popupOverlay em ' + MODAL_HTML_URL);
  }

  document.body.appendChild(overlayEl);
  bindModalEvents();
}

// encontra o botão do dashboard (qualquer um dos ids aceitos)
function findOpenButton() {
  for (const sel of OPEN_BTN_SELECTORS) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

// API pública
window.modalCriarViagem = {
  open: async () => { await ensureModalLoaded(); openModal(); },
  close: closeModal,
};

// wiring
document.addEventListener('DOMContentLoaded', () => {
  const btn = findOpenButton();
  if (btn) {
    btn.addEventListener('click', async () => {
      await ensureModalLoaded();
      openModal();
    });
  }
});

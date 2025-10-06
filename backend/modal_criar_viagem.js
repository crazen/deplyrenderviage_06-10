import { buscarViagemIdPorLink } from './dataApi.js'

import{inserirDestinosManualTeste } from './dataApi.js'

const elementosUI = {
  btnAbrir: document.getElementById('btn-abrir'),
  btnCriarNova: document.getElementById('btn-criar-nova'),
  btnConfirmar: document.getElementById('confirmBtn'),
  btnFechar: document.querySelector('[data-close]'),
  btnColar: document.getElementById('enablePaste'),
  popupOverlay: document.getElementById('popupOverlay'),
  linkInput: document.getElementById('linkInput')
}

function openPopup() {
  elementosUI.popupOverlay?.classList.add('active')
}

function fecharModal() {
  elementosUI.popupOverlay?.classList.remove('active')
  if (elementosUI.linkInput) elementosUI.linkInput.value = ''
  elementosUI.btnConfirmar?.classList.remove('show')
}

function closePopupOnOverlay(event) {
  if (event.target === elementosUI.popupOverlay) {
    fecharModal()
  }
}

function criarNovaViagem() {
  console.log('Criar nova viagem clicado')
  window.location.href = '../frontend/criar-viagem.html'
  fecharModal()
}

function toggleConfirmButton() {
  elementosUI.btnConfirmar?.classList.add('show')
}

async function confirmarLink() {
  const link = elementosUI.linkInput?.value.trim()

  if (!link) {
    alert('Informe um link válido.')
    return
  }

  const viagemId = await buscarViagemIdPorLink(link)

  if (!viagemId) {
    alert('Não encontramos nenhuma viagem com esse link.')
    return
  }

  window.location.href = `bem_vindo_a_viagem.html?viagemId=${viagemId}`
}

async function colarTexto() {
  elementosUI.linkInput?.focus()
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const txt = await navigator.clipboard.readText()
      if (txt && elementosUI.linkInput) {
        elementosUI.linkInput.value = txt
        toggleConfirmButton()
      }
    }
  } catch (err) {
    console.warn('Não foi possível ler a área de transferência:', err)
  }
}

function inicializar() {
  elementosUI.btnAbrir?.addEventListener('click', openPopup)
  elementosUI.btnCriarNova?.addEventListener('click', criarNovaViagem)
  elementosUI.btnConfirmar?.addEventListener('click', confirmarLink)
  elementosUI.btnFechar?.addEventListener('click', fecharModal)
  elementosUI.popupOverlay?.addEventListener('click', closePopupOnOverlay)
  elementosUI.linkInput?.addEventListener('input', toggleConfirmButton)
  elementosUI.btnColar?.addEventListener('click', colarTexto)
}

document.addEventListener('DOMContentLoaded', inicializar)

//inserirDestinosManualTeste();

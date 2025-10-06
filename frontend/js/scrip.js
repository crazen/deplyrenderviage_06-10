document.addEventListener('DOMContentLoaded', () => {
  // --------- CALENDÁRIO ----------
  const modal = document.getElementById('calendarModal');
  const modalContent = modal.querySelector('.calendar-content');
  const daysContainer = document.getElementById('calendarDays');
  const calendarTitle = document.getElementById('calendarTitle');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const closeBtn = document.getElementById('closeCalendar');
  const inputInicio = document.getElementById('dataInicio');
  const inputFim = document.getElementById('dataFim');
  const iconStart = document.getElementById('iconStart');
  const iconEnd = document.getElementById('iconEnd');

  let currentDate = new Date();
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  let selectedInput = null;

  function openCalendarFor(inputEl) {
    selectedInput = inputEl;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    gerarDias();
    setTimeout(()=> modalContent.focus(), 40);
  }
  function closeCalendar() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    selectedInput = null;
  }

  [inputInicio, inputFim].forEach(inp => inp && inp.addEventListener('click', ()=> openCalendarFor(inp)));
  if(iconStart) iconStart.addEventListener('click', ()=> openCalendarFor(inputInicio));
  if(iconEnd) iconEnd.addEventListener('click', ()=> openCalendarFor(inputFim));
  prevBtn.addEventListener('click', ()=> { currentDate.setMonth(currentDate.getMonth()-1); gerarDias(); });
  nextBtn.addEventListener('click', ()=> { currentDate.setMonth(currentDate.getMonth()+1); gerarDias(); });
  closeBtn.addEventListener('click', closeCalendar);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeCalendar(); });

  function gerarDias() {
    daysContainer.innerHTML = '';
    const ano = currentDate.getFullYear();
    const mes = currentDate.getMonth();
    calendarTitle.textContent = currentDate.toLocaleDateString('pt-BR',{month:'long', year:'numeric'});

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes+1, 0).getDate();
    const offset = (primeiroDia + 6) % 7;

    for (let i=0;i<offset;i++) daysContainer.appendChild(Object.assign(document.createElement('div'),{className:'empty'}));

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    for (let d=1; d<=diasNoMes; d++){
      const cell=document.createElement('div');
      cell.textContent=d;
      const dataClicada = new Date(ano, mes, d);
      dataClicada.setHours(0,0,0,0);

      // marca hoje
      if(d===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear()) {
        cell.classList.add('today');
      }

      cell.addEventListener('click',()=>{
        if(!selectedInput) return;
        const dia=String(d).padStart(2,'0');
        const mesStr=String(mes+1).padStart(2,'0');
        const valor = `${dia}/${mesStr}/${ano}`;

        if(selectedInput === inputInicio){
          // início não pode ser no passado
          if(dataClicada < hoje){
            alert("A data de início não pode estar no passado!");
            return;
          }
          inputInicio.value = valor;

          // se já tem fim, validar
          if(inputFim.value){
            const fimData = parseDate(inputFim.value);
            if(fimData <= dataClicada){
              alert("A data de fim deve ser depois da data de início!");
              inputFim.value = "";
            }
          }
        } else if(selectedInput === inputFim){
          if(!inputInicio.value){
            alert("Selecione primeiro a data de início!");
            return;
          }
          const inicioData = parseDate(inputInicio.value);
          if(dataClicada <= inicioData){
            alert("A data de fim deve ser depois da data de início!");
            return;
          }
          inputFim.value = valor;
        }
        closeCalendar();
      });
      daysContainer.appendChild(cell);
    }
  }

  function parseDate(str){
    const [dia, mes, ano] = str.split("/").map(Number);
    return new Date(ano, mes-1, dia);
  }

  // --------- ORÇAMENTO ----------
  const orcamentoInput = document.getElementById('orcamento');
  const valorOrcamento = document.getElementById('valorOrcamento');
  function formatarValor(v) {
    return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
  }
  function atualizarOrcamento(){
    const val = parseInt(orcamentoInput.value,10);
    valorOrcamento.textContent = formatarValor(val);
    const min = Number(orcamentoInput.min), max = Number(orcamentoInput.max);
    const pct = ((val - min) / (max - min)) * 100;
    orcamentoInput.style.background = `linear-gradient(to right, var(--range-fill) 0%, var(--range-fill) ${pct}%, var(--range-track) ${pct}%, var(--range-track) 100%)`;
  }
  orcamentoInput.addEventListener('input', atualizarOrcamento);
  atualizarOrcamento();

  // --------- PARTICIPANTES ----------
  const inputPart=document.getElementById('novoParticipante');
  const btnAdd=document.getElementById('btnAdd');
  const chipsWrap=document.getElementById('participantes');

  const maxParticipantes=6;

  function sanitize(text){const d=document.createElement('div');d.textContent=text;return d.innerHTML;}
  function atualizarContador(){ contador.textContent=`${chipsWrap.children.length}/${maxParticipantes}`; }

  function addParticipante(nome){
    if(!nome.trim()||chipsWrap.children.length>=maxParticipantes) return;
    const chip=document.createElement('div');
    chip.className='chip';
    chip.innerHTML=`${sanitize(nome)} <button class="remove" type="button">&times;</button>`;
    chip.querySelector('.remove').addEventListener('click',()=>{chip.remove();atualizarContador();});
    chipsWrap.appendChild(chip);
    inputPart.value='';
    atualizarContador();
  }
  btnAdd.addEventListener('click',()=>addParticipante(inputPart.value));
  inputPart.addEventListener('keydown',e=>{ if(e.key==='Enter'){e.preventDefault();addParticipante(inputPart.value);} });
  atualizarContador();

  // --------- DESTINOS ----------
  const destinos = [
    { nome: "Rio de Janeiro", img: "img/rio.jpg" },
    { nome: "São Paulo", img: "img/saopaulo.jpg" },
    { nome: "Florianópolis", img: "img/florianopolis.jpg" },
    { nome: "Gramado", img: "img/gramado.jpeg" },
    { nome: "Salvador", img: "img/salvador.jpg" },
    { nome: "Fortaleza", img: "img/fortaleza.jpg" },
    { nome: "Buenos Aires", img: "img/buenosaires.jpeg" }
  ];
  const destinoInput=document.getElementById("destino");
  const sugestoesBox=document.getElementById("sugestoesDestinos");
  destinoInput.addEventListener("input",()=>{
    const valor=destinoInput.value.toLowerCase();
    sugestoesBox.innerHTML="";
    if(!valor){sugestoesBox.style.display="none";return;}
    const filtrados=destinos.filter(d=>d.nome.toLowerCase().includes(valor));
    if(filtrados.length>0){
      filtrados.forEach(dest=>{
        const item=document.createElement("div");
        item.classList.add("sugestao-item");
        item.innerHTML=`<img src="${dest.img}" alt="${dest.nome}"><span>${dest.nome}</span>`;
        item.addEventListener("click",()=>{
          destinoInput.value=dest.nome;
          sugestoesBox.style.display="none";
        });
        sugestoesBox.appendChild(item);
      });
      sugestoesBox.style.display="block";
    } else {sugestoesBox.style.display="none";}
  });
  document.addEventListener("click",e=>{
    if(!destinoInput.contains(e.target)&&!sugestoesBox.contains(e.target)){
      sugestoesBox.style.display="none";
    }
  });
});

  // --------- LOGO REDIRECIONAR PARA DASHBOARD ----------
  const logoHome = document.getElementById('logoHome');
  if (logoHome) {
    logoHome.style.cursor = 'pointer';
    logoHome.addEventListener('click', () => {
      window.location.href = 'dashboard.html'; // redireciona para o dashboard
    });
  }


function irParaEtapa2(){alert("Avançando para a próxima etapa...");}

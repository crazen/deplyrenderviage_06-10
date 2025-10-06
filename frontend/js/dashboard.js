const tripsData = JSON.parse(document.getElementById("trips-data").textContent);
const container = document.getElementById("cards-container");

function renderTrips() {
  container.innerHTML = "";

  tripsData.forEach((trip, index) => {
    const card = document.createElement("article");
    card.className = "trip-card";
    card.innerHTML = `
      <img src="${trip.image}" alt="${trip.city}">
      <div class="trip-body">
        <h3>${trip.city}</h3>
        <p>${trip.date}</p>
        <p>${trip.people} pessoas</p>
        <button class="btn-primary">Visualizar Atividades</button>
        <div class="trip-actions">
          <button class="icon-circle" title="Chat" onclick="abrirChat('${trip.city}')">💬</button>
          <button class="icon-circle" title="Excluir" onclick="deleteTrip(${index})">🗑️</button>
        </div>
        <div class="trip-avatars">
          ${trip.participants.slice(0,3).map(p => 
            `<img src="${p.avatar}" alt="${p.name}" title="${p.name}">`
          ).join("")}
          ${trip.participants.length > 3 
            ? `<span class="more">+${trip.participants.length - 3}</span>` 
            : ""}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function novaViagem() {
  alert("Abrir formulário para criar uma nova viagem!");
}

function abrirChat(city) {
  alert("Abrindo chat da viagem: " + city);
}

function deleteTrip(index) {
  if (confirm("Deseja realmente excluir esta viagem?")) {
    tripsData.splice(index, 1);
    renderTrips();
  }
}

renderTrips();

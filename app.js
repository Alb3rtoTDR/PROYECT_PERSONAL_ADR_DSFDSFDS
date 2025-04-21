import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYp0ibzSww3PRq0Xr3KB4aKOjItVfHfgk",
  authDomain: "serum2025-c9486.firebaseapp.com",
  databaseURL: "https://serum2025-c9486-default-rtdb.firebaseio.com",
  projectId: "serum2025-c9486",
  storageBucket: "serum2025-c9486.firebasestorage.app",
  messagingSenderId: "662766632659",
  appId: "1:662766632659:web:23b5adac7b7ba776219e26"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tablaLibres = document.getElementById("tablaLibres");
const tablaOcupadas = document.getElementById("tablaOcupadas");
const buscadorGlobal = document.getElementById("buscadorGlobal");

let plazas = [];

function renderTablas(filtro = "") {
  tablaLibres.innerHTML = "";
  tablaOcupadas.innerHTML = "";

  const filtroTexto = filtro.trim().toLowerCase();

  const libres = plazas
    .filter(p => p.estado === "libre" && coincideFiltro(p, filtroTexto))
    .sort((a, b) => a.distancia - b.distancia);

  const ocupadas = plazas
    .filter(p => p.estado === "ocupado" && coincideFiltro(p, filtroTexto))
    .sort((a, b) => a.distancia - b.distancia);

  libres.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.centroSalud}</td>
      <td>${p.departamento}</td>
      <td>${p.provincia}</td>
      <td>${p.distrito}</td>
      <td>${p.distancia}</td>
      <td><button class="btn btn-sm btn-outline-primary" onclick="ocupar('${p.id}')">Ocupar</button></td>
    `;
    tablaLibres.appendChild(row);
  });

  ocupadas.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.centroSalud}</td>
      <td>${p.departamento}</td>
      <td>${p.provincia}</td>
      <td>${p.distrito}</td>
      <td>${p.distancia}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="restaurar('${p.id}')">Restaurar</button></td>
    `;
    tablaOcupadas.appendChild(row);
  });
}

function coincideFiltro(p, texto) {
  return (
    p.centroSalud.toLowerCase().includes(texto) ||
    p.provincia.toLowerCase().includes(texto) ||
    p.distrito.toLowerCase().includes(texto)
  );
}

// Escucha en tiempo real
onValue(ref(db, 'plazas'), (snapshot) => {
  plazas = [];
  snapshot.forEach(child => {
    const data = child.val();
    data.id = child.key;
    plazas.push(data);
  });
  renderTablas();
});

// Botones globales
window.ocupar = (id) => {
  update(ref(db, `plazas/${id}`), { estado: "ocupado" });
};

window.restaurar = (id) => {
  update(ref(db, `plazas/${id}`), { estado: "libre" });
};

// Filtro global
buscadorGlobal.addEventListener("input", () => {
  renderTablas(buscadorGlobal.value);
});

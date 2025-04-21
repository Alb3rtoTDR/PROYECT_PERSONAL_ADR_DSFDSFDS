import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYp0ibzSww3PRq0Xr3KB4aKOjItVfHfgk",
  authDomain: "serum2025-c9486.firebaseapp.com",
  databaseURL: "https://serum2025-c9486-default-rtdb.firebaseio.com",
  projectId: "serum2025-c9486",
  storageBucket: "serum2025-c9486.appspot.com",
  messagingSenderId: "662766632659",
  appId: "1:662766632659:web:23b5adac7b7ba776219e26"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias DOM
const tablaLibres = document.getElementById("tablaLibres");
const tablaOcupadas = document.getElementById("tablaOcupadas");
const buscadorGlobal = document.getElementById("buscadorGlobal");

let plazas = [];

// Escuchar datos de Firebase en tiempo real
onValue(ref(db, 'plazas'), (snapshot) => {
  plazas = [];
  snapshot.forEach(child => {
    const data = child.val();
    data.id = child.key;
    plazas.push(data);
  });
  renderTablas();
});

// Filtrar resultados en tiempo real
buscadorGlobal.addEventListener("input", () => {
  renderTablas(buscadorGlobal.value);
});

// Mostrar plazas en tablas
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
    row.classList.add("table-success");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.centroSalud}</td>
      <td>${p.departamento}</td>
      <td>${p.provincia}</td>
      <td>${p.distrito}</td>
      <td>${p.distancia}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onclick="ocupar('${p.id}', this)">
          <i class="bi bi-check-circle"></i> Ocupar
        </button>
      </td>
    `;
    tablaLibres.appendChild(row);
  });

  ocupadas.forEach((p, i) => {
    const row = document.createElement("tr");
    row.classList.add("table-danger");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.centroSalud}</td>
      <td>${p.departamento}</td>
      <td>${p.provincia}</td>
      <td>${p.distrito}</td>
      <td>${p.distancia}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onclick="restaurar('${p.id}', this)">
          <i class="bi bi-arrow-counterclockwise"></i> Restaurar
        </button>
      </td>
    `;
    tablaOcupadas.appendChild(row);
  });
}

// Filtrado por texto
function coincideFiltro(p, texto) {
  return (
    p.centroSalud.toLowerCase().includes(texto) ||
    p.provincia.toLowerCase().includes(texto) ||
    p.distrito.toLowerCase().includes(texto)
  );
}

// Acción: Ocupar plaza
window.ocupar = (id, btn) => {
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="bi bi-hourglass-split"></i> Ocupando...`;
  }
  update(ref(db, `plazas/${id}`), { estado: "ocupado" });
};

// Acción: Restaurar plaza
window.restaurar = (id, btn) => {
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="bi bi-hourglass-split"></i> Restaurando...`;
  }
  update(ref(db, `plazas/${id}`), { estado: "libre" });
};

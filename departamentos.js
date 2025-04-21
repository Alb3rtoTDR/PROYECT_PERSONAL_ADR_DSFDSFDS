import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYp0ibzSww3PRq0Xr3KB4aKOjItVfHfgk",
  authDomain: "serum2025-c9486.firebaseapp.com",
  databaseURL: "https://serum2025-c9486-default-rtdb.firebaseio.com",
  projectId: "serum2025-c9486",
  storageBucket: "serum2025-c9486.appspot.com",
  messagingSenderId: "662766632659",
  appId: "1:662766632659:web:23b5adac7b7ba776219e26"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const acordeonDeptos = document.getElementById("accordionDepartamentos");

onValue(ref(db, 'plazas'), (snapshot) => {
  const libres = [];
  snapshot.forEach(child => {
    const data = child.val();
    if (data.estado === "libre") {
      libres.push(data);
    }
  });
  renderTopPorDepartamento(libres);
});

function renderTopPorDepartamento(libres) {
  acordeonDeptos.innerHTML = "";

  const porDepartamento = {};

  libres.forEach(p => {
    const depto = p.departamento;
    if (!porDepartamento[depto]) {
      porDepartamento[depto] = [];
    }
    porDepartamento[depto].push(p);
  });

  Object.entries(porDepartamento).forEach(([departamento, plazas], idx) => {
    const top10 = plazas
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 10);

    const collapseId = `collapse${idx}`;
    const card = document.createElement("div");
    card.classList.add("accordion-item");
    card.innerHTML = `
      <h2 class="accordion-header" id="heading${idx}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
          ${departamento} <span class="badge bg-primary ms-2">${plazas.length}</span>
        </button>
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse" data-bs-parent="#accordionDepartamentos">
        <div class="accordion-body p-0">
          <table class="table table-sm table-striped mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Centro</th>
                <th>Provincia</th>
                <th>Distrito</th>
                <th>Distancia</th>
              </tr>
            </thead>
            <tbody>
              ${top10.map((p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${p.centroSalud}</td>
                  <td>${p.provincia}</td>
                  <td>${p.distrito}</td>
                  <td>${p.distancia}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    acordeonDeptos.appendChild(card);
  });
}

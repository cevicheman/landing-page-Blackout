/* ============================================================
   BlackOut — Lógica de la landing (JavaScript)
   - Menú responsive (SPA, desplaza entre secciones)
   - Formulario con fetch HTTP POST
   - Alertas con fetch HTTP GET
   ============================================================ */

// API pública de pruebas para demostrar las peticiones HTTP
const API = "https://jsonplaceholder.typicode.com";

/* ---------- 1. Menú móvil ---------- */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Cierra el menú móvil al hacer clic en un enlace
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

/* ---------- 2. Formulario de contacto (fetch HTTP POST) ---------- */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const lista = document.getElementById("solicitudesLista");
const listaVacio = document.getElementById("solicitudesVacio");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    empresa: form.empresa.value.trim(),
    email: form.email.value.trim(),
    servicio: form.servicio.value,
  };

  formStatus.className = "text-sm text-slate-400";
  formStatus.textContent = "Enviando solicitud...";
  formStatus.classList.remove("hidden");

  try {
    // Petición HTTP POST: enviamos los datos del formulario
    const res = await fetch(`${API}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!res.ok) throw new Error("Respuesta no válida del servidor");

    const respuesta = await res.json();

    formStatus.className = "text-sm text-accent";
    formStatus.textContent = `Solicitud enviada correctamente (ID #${respuesta.id}).`;

    // Mostramos los datos enviados en la sección de interacción
    agregarSolicitud(datos, respuesta.id);
    form.reset();
  } catch (error) {
    formStatus.className = "text-sm text-red-400";
    formStatus.textContent = "Ocurrió un error al enviar. Inténtalo de nuevo.";
  }
});

// Renderiza una solicitud enviada en la lista (interacción con los datos del formulario)
function agregarSolicitud(datos, id) {
  listaVacio.classList.add("hidden");

  const item = document.createElement("li");
  item.className =
    "fade-in rounded-xl border border-line bg-base p-4 text-sm";
  item.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-semibold text-white">${escapar(datos.empresa)}</span>
      <span class="font-mono text-xs text-accent">#${id}</span>
    </div>
    <p class="mt-1 text-slate-400">${escapar(datos.email)}</p>
    <p class="mt-2 inline-block rounded bg-accent/10 px-2 py-1 text-xs text-accent">
      ${escapar(datos.servicio)}
    </p>
  `;
  lista.prepend(item);
}

/* ---------- 3. Alertas de seguridad (fetch HTTP GET) ---------- */
const alertasLista = document.getElementById("alertasLista");
const recargarBtn = document.getElementById("recargarAlertas");

const niveles = ["Crítico", "Alto", "Medio"];
const coloresNivel = {
  "Crítico": "text-red-400 border-red-400/40",
  "Alto": "text-amber-400 border-amber-400/40",
  "Medio": "text-accent border-accent/40",
};

async function cargarAlertas() {
  alertasLista.innerHTML =
    '<p class="text-sm text-slate-500">Cargando alertas...</p>';

  try {
    // Petición HTTP GET: obtenemos datos del servidor
    const res = await fetch(`${API}/posts?_limit=6`);
    if (!res.ok) throw new Error("No se pudieron cargar las alertas");

    const datos = await res.json();
    alertasLista.innerHTML = "";

    datos.forEach((d, i) => {
      const nivel = niveles[i % niveles.length];
      const card = document.createElement("article");
      card.className =
        "fade-in rounded-xl border border-line bg-surface/40 p-5";
      card.innerHTML = `
        <span class="inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${coloresNivel[nivel]}">
          ${nivel}
        </span>
        <h3 class="mt-3 font-semibold capitalize text-white">${escapar(d.title)}</h3>
        <p class="mt-1 line-clamp-2 text-sm text-slate-400">${escapar(d.body)}</p>
      `;
      alertasLista.appendChild(card);
    });
  } catch (error) {
    alertasLista.innerHTML =
      '<p class="text-sm text-red-400">Error al cargar las alertas.</p>';
  }
}

recargarBtn.addEventListener("click", cargarAlertas);

// Carga inicial de alertas
cargarAlertas();

/* ---------- Utilidad: escapar HTML para evitar inyección ---------- */
function escapar(texto = "") {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

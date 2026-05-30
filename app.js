const CONFIG = window.LABESA_CONFIG || {};
const hasSupabase = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && window.supabase);
const supabaseClient = hasSupabase
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

const STORE_KEY = "labesa-movilidad-local";
const THEME_KEY = "labesa-movilidad-theme";
const WIALON_STORE_KEY = "labesa-wialon-config";
const today = new Date();

const modules = [
  { id: "dashboard", title: "Dashboard general", icon: "D" },
  { id: "vehicles", title: "Vehiculos", icon: "V" },
  { id: "drivers", title: "Choferes", icon: "C" },
  { id: "gps", title: "GPS", icon: "G" },
  { id: "finance", title: "Finanzas", icon: "$" }
];

const tableMap = {
  vehicles: "vehicles",
  drivers: "drivers",
  documents: "vehicle_documents",
  services: "services",
  gps: "gps_units",
  income: "income",
  expenses: "expenses",
  loans: "loans"
};

const fieldSets = {
  vehicles: [
    ["internal_code", "Codigo interno", "text"],
    ["unit_type", "Tipo de unidad", "text"],
    ["brand", "Marca", "text"],
    ["model", "Modelo", "text"],
    ["year", "Ano", "number"],
    ["color", "Color", "text"],
    ["plates", "Placas", "text"],
    ["vin", "Numero de serie / VIN", "text"],
    ["engine_number", "Numero de motor", "text"],
    ["driver_name", "Chofer asignado", "text"],
    ["status", "Estatus", "select", ["activo", "inactivo", "taller", "disponible", "rentado"]],
    ["photo_url", "Foto del coche (URL publica)", "url"],
    ["__file_photo_url", "Subir foto del coche", "file", "vehicle-photos", "photo_url"],
    ["insurance_expires_at", "Vencimiento de seguro", "date"],
    ["registration_expires_at", "Vencimiento tarjeta de circulacion", "date"],
    ["verification_expires_at", "Vencimiento verificacion", "date"],
    ["tax_expires_at", "Vencimiento tenencia", "date"],
    ["gps_expires_at", "Vencimiento GPS", "date"],
    ["next_service_date", "Proximo servicio", "date"],
    ["service_notes", "Notas de servicios / calendario", "textarea"],
    ["notes", "Notas generales", "textarea"]
  ],
  drivers: [
    ["full_name", "Nombre completo", "text"],
    ["phone", "Telefono", "tel"],
    ["address", "Direccion", "textarea"],
    ["ine", "INE", "text"],
    ["license", "Licencia", "text"],
    ["license_expiration", "Vencimiento de licencia", "date"],
    ["vehicle_assigned", "Vehiculo asignado", "vehicle-select"],
    ["photo_url", "Foto del chofer (URL publica)", "url"],
    ["__file_photo_url", "Subir foto del chofer", "file", "driver-photos", "photo_url"],
    ["status", "Estatus", "select", ["activo", "inactivo", "suspendido"]],
    ["notes", "Notas", "textarea"]
  ],
  documents: [
    ["vehicle_code", "Vehiculo", "vehicle-select"],
    ["document_name", "Documento", "select", ["Tarjeta de circulacion", "Poliza de seguro", "Verificacion", "Tenencia", "Licencia del chofer", "Factura", "Otro"]],
    ["file_url", "Archivo / foto / PDF (URL publica)", "url"],
    ["__file_file_url", "Subir archivo", "file", "vehicle-documents", "file_url"],
    ["issued_at", "Fecha de emision", "date"],
    ["expires_at", "Fecha de vencimiento", "date"],
    ["notes", "Notas", "textarea"]
  ],
  services: [
    ["vehicle_code", "Vehiculo", "vehicle-select"],
    ["service_type", "Tipo de servicio", "text"],
    ["service_date", "Fecha del servicio", "date"],
    ["next_service_date", "Proxima fecha de servicio", "date"],
    ["current_km", "Kilometraje actual", "number"],
    ["next_km", "Proximo kilometraje", "number"],
    ["provider", "Taller o proveedor", "text"],
    ["cost", "Costo", "number"],
    ["status", "Estatus", "select", ["pendiente", "realizado", "programado"]],
    ["receipt_url", "Fotos o comprobantes (URL publica)", "url"],
    ["__file_receipt_url", "Subir comprobante", "file", "service-receipts", "receipt_url"],
    ["notes", "Anotaciones", "textarea"]
  ],
  gps: [
    ["vehicle_code", "Vehiculo", "vehicle-select"],
    ["wialon_unit_id", "ID de unidad en Wialon", "text"],
    ["gps_name", "Nombre de unidad GPS", "text"],
    ["gps_status", "Estatus GPS", "select", ["activo", "sin conexion", "suspendido"]],
    ["last_location", "Ultima ubicacion", "text"],
    ["last_connection", "Ultima conexion", "datetime-local"],
    ["location_url", "Link de ubicacion", "url"],
    ["payment_date", "Fecha de pago GPS", "date"],
    ["expires_at", "Vencimiento GPS", "date"],
    ["notes", "Notas", "textarea"]
  ],
  income: [
    ["vehicle_code", "Vehiculo", "vehicle-select"],
    ["driver_name", "Chofer", "text"],
    ["concept", "Concepto", "text"],
    ["date", "Fecha", "date"],
    ["amount", "Monto", "number"],
    ["payment_method", "Metodo de pago", "text"],
    ["period", "Semana o periodo", "text"],
    ["notes", "Notas", "textarea"]
  ],
  expenses: [
    ["vehicle_code", "Vehiculo", "vehicle-select"],
    ["concept", "Concepto", "text"],
    ["date", "Fecha", "date"],
    ["amount", "Monto", "number"],
    ["category", "Categoria", "select", ["gasolina", "mantenimiento", "GPS", "seguro", "refaccion", "multa", "otro"]],
    ["notes", "Notas", "textarea"]
  ],
  loans: [
    ["borrower_name", "Persona / cliente", "text"],
    ["vehicle_code", "Vehiculo relacionado", "vehicle-select"],
    ["loan_date", "Fecha del prestamo", "date"],
    ["amount", "Monto prestado", "number"],
    ["recovered_amount", "Monto recuperado", "number"],
    ["due_date", "Fecha compromiso de pago", "date"],
    ["status", "Estatus", "select", ["pendiente", "parcial", "pagado", "vencido"]],
    ["notes", "Notas", "textarea"]
  ]
};

const seed = {
  vehicles: [
    {
      id: crypto.randomUUID(),
      internal_code: "LB-001",
      unit_type: "Sedan",
      brand: "Nissan",
      model: "Versa",
      year: 2022,
      color: "Blanco",
      plates: "ABC-123",
      driver_name: "Chofer por asignar",
      status: "activo",
      notes: "Registro de ejemplo editable."
    }
  ],
  drivers: [],
  documents: [
    {
      id: crypto.randomUUID(),
      vehicle_code: "LB-001",
      document_name: "Poliza de seguro",
      issued_at: isoDate(-250),
      expires_at: isoDate(18),
      notes: "Ejemplo de documento proximo a vencer."
    }
  ],
  services: [],
  gps: [],
  income: [
    {
      id: crypto.randomUUID(),
      vehicle_code: "LB-001",
      driver_name: "Chofer por asignar",
      concept: "Renta semanal",
      date: isoDate(-3),
      amount: 3200,
      payment_method: "Transferencia",
      period: "Semana actual"
    }
  ],
  expenses: [
    {
      id: crypto.randomUUID(),
      vehicle_code: "LB-001",
      concept: "Gasolina",
      date: isoDate(-2),
      amount: 900,
      category: "gasolina"
    }
  ],
  loans: []
};

let state = loadLocal();
let activeView = "dashboard";
let activeRecordType = null;
let activeRecordId = null;
let wialonSession = null;
let wialonUnits = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", init);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

function init() {
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
  renderNavigation();
  bindAuth();
  bindDialog();
  bindVehicleProfileDialog();
  renderAll();
  if (!hasSupabase) {
    $("#auth-message").textContent = "Modo revision: agrega credenciales Supabase en config.js para datos reales.";
  }
}

function bindAuth() {
  $("#demo-login").addEventListener("click", showApp);
  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = $("#login-email").value.trim();
    const password = $("#login-password").value;
    if (!hasSupabase) {
      showApp();
      return;
    }
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      $("#auth-message").textContent = error.message;
      return;
    }
    await syncFromSupabase();
    showApp();
  });
  $("#sync-btn").addEventListener("click", async () => {
    await syncFromSupabase();
    renderAll();
  });
  $("#theme-toggle").addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    applyTheme(nextTheme);
  });
  $("#logout-btn").addEventListener("click", async () => {
    if (hasSupabase) await supabaseClient.auth.signOut();
    $("#app-shell").classList.add("is-hidden");
    $("#login-screen").classList.remove("is-hidden");
    $("#login-password").value = "";
  });
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  const button = $("#theme-toggle");
  if (button) button.textContent = isLight ? "Oscuro" : "Claro";
}

function showApp() {
  $("#login-screen").classList.add("is-hidden");
  $("#app-shell").classList.remove("is-hidden");
  renderAll();
}

function renderNavigation() {
  const markup = modules.map((item) => navButton(item)).join("");
  const mobileItems = [
    modules.find((item) => item.id === "dashboard"),
    modules.find((item) => item.id === "vehicles"),
    modules.find((item) => item.id === "gps"),
    modules.find((item) => item.id === "finance"),
    modules.find((item) => item.id === "drivers")
  ].filter(Boolean);
  $("#main-menu").innerHTML = markup;
  $("#bottom-nav").innerHTML = mobileItems.map((item) => navButton(item)).join("");
  $$(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
}

function navButton(item) {
  return `
    <button class="nav-btn ${activeView === item.id ? "active" : ""}" data-view="${item.id}" type="button">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.title.replace(" general", "")}</span>
    </button>
  `;
}

function switchView(view) {
  activeView = view;
  $$(".view").forEach((section) => section.classList.remove("active-view"));
  $(`#${view}-view`).classList.add("active-view");
  $("#view-title").textContent = modules.find((item) => item.id === view).title;
  renderNavigation();
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderModule("vehicles", "Vehiculos registrados", "Busca, filtra y administra cada unidad.");
  renderModule("drivers", "Choferes", "Licencias, estatus y asignaciones.");
  renderModule("documents", "Documentos del vehiculo", "Semaforo automatico por vencimiento.");
  renderModule("services", "Servicios y mantenimientos", "Historial por unidad y proximos servicios.");
  renderModule("gps", "GPS / Wialon", "Preparado para integracion con API de Wialon.");
  renderFinance();
}

function renderDashboard() {
  const activeVehicles = state.vehicles.filter((v) => v.status === "activo").length;
  const alertItems = collectAlerts();
  const pendingServices = state.vehicles.filter((v) => statusFromDate(v.next_service_date).key !== "green").length;
  const income = sum(state.income);
  const expenses = sum(state.expenses);
  const balance = income - expenses;
  const maxMoney = Math.max(income, expenses, 1);
  const vehicleProfitRows = getVehicleProfitability();

  $("#dashboard-view").innerHTML = `
    <section class="hero-card">
      <img class="hero-logo" src="assets/logo-labesa-oficial.jpeg" alt="LaBeSa Movilidad" />
      <div class="hero-copy">
        <h3>LaBeSa Movilidad</h3>
        <p>Acercamos personas y negocios.</p>
        <span class="status-pill">Excelente</span>
      </div>
      <button class="primary-btn hero-action" data-view="vehicles" type="button">Ver flotilla</button>
      <div class="hero-lines">
        <span>Version operativa v8 - Finanzas editables</span>
      </div>
    </section>

    <div class="section-title-row">
      <h3>Resumen operativo</h3>
    </div>

    <div class="stats-grid operational-grid">
      ${statCard("Vehiculos", state.vehicles.length, `${activeVehicles} activos`)}
      ${statCard("Conductores", state.drivers.length, "capturados")}
      ${statCard("Calendario", alertItems.length, "alertas")}
      ${statCard("Ingresos", money(income), "mes actual")}
      ${statCard("Gastos", money(expenses), "mes actual")}
      ${statCard("Utilidad", money(balance), "automatico")}
    </div>
    <button class="primary-btn wide-action" data-view="finance" type="button">Registrar ingreso o gasto</button>

    <div class="insight-grid">
      <section class="module-panel chart-card">
        <div class="panel-header">
          <div>
            <h3>Ingresos vs gastos</h3>
            <p>Mes actual</p>
          </div>
          <strong>${money(balance)} utilidad</strong>
        </div>
        <div class="mini-bars" aria-label="Grafica visual de ingresos y gastos">
          ${financeBars(income, expenses)}
        </div>
      </section>

      <section class="module-panel profitability-card">
        <h3>Rentabilidad por vehiculo</h3>
        ${vehicleProfitRows.length ? vehicleProfitRows.map((row) => profitRow(row.label, row.percent, row.balance)).join("") : `<div class="empty-state">Sin datos financieros por vehiculo.</div>`}
      </section>
    </div>

    <div class="dashboard-layout">
      <section class="module-panel">
        <div class="panel-header">
          <div>
            <h3>Accesos rapidos</h3>
            <p>Control operativo de flotilla</p>
          </div>
        </div>
        <div class="quick-grid">
          ${modules.slice(1).map((item) => `
            <button class="quick-card" data-view="${item.id}" type="button">
              <span>${item.icon}</span>
              ${item.title}
            </button>
          `).join("")}
        </div>
      </section>
      <section class="module-panel">
        <div class="panel-header">
          <div>
            <h3>Alertas prioritarias</h3>
            <p>Verde vigente, amarillo proximo, rojo vencido</p>
          </div>
          <button class="text-link" data-view="vehicles" type="button">Ver calendario</button>
        </div>
        <div class="alerts-list">
          ${alertItems.length ? alertItems.slice(0, 8).map(alertRow).join("") : `<div class="empty-state">No hay vencimientos criticos.</div>`}
        </div>
      </section>
      <section class="module-panel">
        <div class="panel-header">
          <div>
            <h3>Servicios pendientes</h3>
            <p>${pendingServices} servicio(s) requieren seguimiento</p>
          </div>
        </div>
        <div class="alerts-list">
          ${state.vehicles.filter((vehicle) => vehicle.next_service_date).slice(0, 6).map((vehicle) => alertRow({
            title: `Servicio ${vehicle.internal_code || vehicle.plates || "Unidad"}`,
            detail: vehicle.model || vehicle.brand || "Vehiculo",
            status: statusFromDate(vehicle.next_service_date)
          })).join("") || `<div class="empty-state">Aun no hay servicios programados.</div>`}
        </div>
      </section>
      <section class="module-panel">
        <div class="panel-header">
          <div>
            <h3>Balance general</h3>
            <p>${money(income)} ingresos / ${money(expenses)} egresos</p>
          </div>
        </div>
        <div class="chart-bars">
          ${barRow("Ingresos", income, maxMoney, "income")}
          ${barRow("Egresos", expenses, maxMoney, "expense")}
          ${barRow("Utilidad", Math.max(balance, 0), maxMoney, "")}
        </div>
      </section>
    </div>
  `;
  $$("#dashboard-view [data-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
}

function renderModule(type, title, subtitle) {
  if (type === "gps") {
    renderGpsModule(title, subtitle);
    return;
  }
  const records = state[type] || [];
  const view = $(`#${type}-view`);
  view.innerHTML = `
    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <button class="primary-btn" data-create="${type}" type="button">Agregar</button>
      </div>
      <div class="toolbar">
        <input data-search="${type}" placeholder="Buscar" />
        <select data-filter="${type}">
          <option value="">Todos los estatus</option>
          <option value="green">Vigente</option>
          <option value="yellow">Proximo a vencer</option>
          <option value="red">Vencido</option>
          <option value="gray">Sin fecha</option>
        </select>
        <button class="small-btn" data-clear="${type}" type="button">Limpiar</button>
      </div>
      <div class="records-grid" data-grid="${type}">
        ${records.map((record) => recordCard(type, record)).join("") || `<div class="empty-state">No hay registros todavia.</div>`}
      </div>
    </section>
  `;
  bindModule(type);
}

function renderGpsModule(title, subtitle) {
  const records = state.gps || [];
  const savedWialon = loadWialonConfig();
  const view = $("#gps-view");
  view.innerHTML = `
    <div class="screen-heading">
      <h3>GPS en tiempo real</h3>
      <p>Monitoreo operativo conectado a Wialon mediante token API.</p>
    </div>
    <section class="module-panel wialon-panel">
      <div class="panel-header">
        <div>
          <h3>Conexion Wialon</h3>
          <p id="wialon-status">${wialonSession ? "Wialon conectado" : "Wialon sin conectar"}</p>
        </div>
      </div>
      <div class="wialon-box">
        <label>
          Servidor Wialon
          <select id="wialon-server">
            <option value="https://hst-api.wialon.com" ${savedWialon.server === "https://hst-api.wialon.com" ? "selected" : ""}>https://hst-api.wialon.com</option>
            <option value="https://kit-api.wialon.com" ${savedWialon.server === "https://kit-api.wialon.com" ? "selected" : ""}>https://kit-api.wialon.com</option>
          </select>
        </label>
        <label>
          Token API Wialon
          <input id="wialon-token" type="password" placeholder="Pega aqui tu token de Wialon" value="${escapeAttr(savedWialon.token)}" />
        </label>
        <div class="wialon-actions">
          <button id="connect-wialon" class="primary-btn" type="button">Conectar Wialon</button>
          <button id="refresh-wialon" class="ghost-btn" type="button">Actualizar GPS</button>
          <button id="disconnect-wialon" class="danger-btn" type="button">Desconectar</button>
        </div>
      </div>
    </section>
    <section class="gps-map" aria-label="Mapa GPS visual">
      <span class="orbit orbit-one"></span>
      <span class="orbit orbit-two"></span>
      <i class="pin pin-a"></i>
      <i class="pin pin-b"></i>
      <i class="pin pin-c"></i>
    </section>
    <section class="module-panel live-gps-panel">
      <div class="panel-header">
        <div>
          <h3>Unidades en Wialon</h3>
          <p id="wialon-count">${wialonUnits.length ? `${wialonUnits.length} unidad(es) encontradas` : "Conecta Wialon para cargar unidades"}</p>
        </div>
      </div>
      <div id="wialon-units" class="wialon-units">
        ${renderWialonUnits()}
      </div>
    </section>
    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <button class="primary-btn" data-create="gps" type="button">Agregar</button>
      </div>
      <div class="records-grid" data-grid="gps">
        ${records.map((record) => recordCard("gps", record)).join("") || `<div class="empty-state">No hay unidades GPS registradas.</div>`}
      </div>
    </section>
  `;
  bindModule("gps");
  bindWialonControls();
}

function bindWialonControls() {
  $("#connect-wialon")?.addEventListener("click", connectWialon);
  $("#refresh-wialon")?.addEventListener("click", refreshWialonUnits);
  $("#disconnect-wialon")?.addEventListener("click", disconnectWialon);
}

function loadWialonConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(WIALON_STORE_KEY)) || {};
    return {
      server: saved.server || CONFIG.WIALON_API_URL || "https://hst-api.wialon.com",
      token: saved.token || CONFIG.WIALON_TOKEN || ""
    };
  } catch {
    return { server: CONFIG.WIALON_API_URL || "https://hst-api.wialon.com", token: CONFIG.WIALON_TOKEN || "" };
  }
}

function saveWialonConfig(server, token) {
  localStorage.setItem(WIALON_STORE_KEY, JSON.stringify({ server, token }));
}

async function connectWialon() {
  const server = $("#wialon-server").value;
  const token = $("#wialon-token").value.trim();
  if (!token) {
    alert("Pega primero tu token API de Wialon.");
    return;
  }
  saveWialonConfig(server, token);
  setWialonStatus("Conectando con Wialon...");
  try {
    const login = await wialonRequest(server, "token/login", { token });
    if (login.error) throw new Error(wialonErrorMessage(login.error));
    wialonSession = { server, sid: login.eid, user: login.au || login.user || null };
    setWialonStatus("Wialon conectado. Cargando unidades...");
    await refreshWialonUnits();
  } catch (error) {
    wialonSession = null;
    setWialonStatus("Wialon sin conectar");
    alert(`No se pudo conectar Wialon: ${error.message}`);
  }
}

async function refreshWialonUnits() {
  if (!wialonSession) {
    await connectWialon();
    return;
  }
  try {
    const data = await wialonRequest(wialonSession.server, "core/search_items", {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: "*",
        sortType: "sys_name"
      },
      force: 1,
      flags: 1025,
      from: 0,
      to: 0
    }, wialonSession.sid);
    if (data.error) throw new Error(wialonErrorMessage(data.error));
    wialonUnits = Array.isArray(data.items) ? data.items : [];
    setWialonStatus("Wialon conectado");
    renderWialonUnitList();
  } catch (error) {
    alert(`No se pudo actualizar GPS: ${error.message}`);
  }
}

async function disconnectWialon() {
  if (wialonSession) {
    await wialonRequest(wialonSession.server, "core/logout", {}, wialonSession.sid).catch(() => {});
  }
  wialonSession = null;
  wialonUnits = [];
  localStorage.removeItem(WIALON_STORE_KEY);
  $("#wialon-token").value = "";
  setWialonStatus("Wialon sin conectar");
  renderWialonUnitList();
}

async function wialonRequest(server, service, params, sid = "") {
  const url = new URL("/wialon/ajax.html", server);
  url.searchParams.set("svc", service);
  url.searchParams.set("params", JSON.stringify(params));
  if (sid) url.searchParams.set("sid", sid);
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function setWialonStatus(message) {
  const status = $("#wialon-status");
  if (status) status.textContent = message;
}

function renderWialonUnitList() {
  const list = $("#wialon-units");
  const count = $("#wialon-count");
  if (count) count.textContent = wialonUnits.length ? `${wialonUnits.length} unidad(es) encontradas` : "Sin unidades cargadas";
  if (list) list.innerHTML = renderWialonUnits();
}

function renderWialonUnits() {
  if (!wialonUnits.length) {
    return `<div class="empty-state">Aun no hay unidades GPS cargadas desde Wialon.</div>`;
  }
  return wialonUnits.map((unit) => {
    const pos = unit.pos || {};
    const hasPosition = Number.isFinite(pos.x) && Number.isFinite(pos.y);
    const mapsUrl = hasPosition ? `https://www.google.com/maps?q=${pos.y},${pos.x}` : "";
    return `
      <article class="wialon-unit">
        <div>
          <strong>${escapeHtml(unit.nm || "Unidad GPS")}</strong>
          <span>${hasPosition ? `${pos.y.toFixed(5)}, ${pos.x.toFixed(5)}` : "Sin ubicacion reciente"}</span>
          <small>${pos.t ? `Ultima conexion: ${formatUnix(pos.t)}` : "Sin fecha de conexion"}</small>
        </div>
        ${mapsUrl ? `<a class="small-btn" href="${mapsUrl}" target="_blank" rel="noreferrer">Mapa</a>` : `<span class="badge">Sin GPS</span>`}
      </article>
    `;
  }).join("");
}

function formatUnix(value) {
  return new Date(value * 1000).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function wialonErrorMessage(code) {
  const messages = {
    1: "token invalido o sesion no autorizada",
    4: "parametros incorrectos",
    7: "permiso denegado",
    8: "token vencido o acceso no permitido",
    1001: "no hay conexion con el servidor Wialon"
  };
  return messages[code] || `codigo de error ${code}`;
}

function financeBars(income, expenses) {
  const max = Math.max(income, expenses, 1);
  const incomeHeight = Math.max(8, Math.round((income / max) * 90));
  const expenseHeight = Math.max(8, Math.round((expenses / max) * 90));
  return `
    <span class="income" style="height:${incomeHeight}%"></span>
    <span class="expense" style="height:${expenseHeight}%"></span>
  `;
}

function getVehicleProfitability() {
  return state.vehicles.map((vehicle) => {
    const code = vehicleKey(vehicle);
    const vehicleIncome = sum(state.income.filter((item) => item.vehicle_code === code));
    const vehicleExpenses = sum(state.expenses.filter((item) => item.vehicle_code === code));
    const vehicleLoans = loanSummary(state.loans.filter((item) => item.vehicle_code === code));
    const balance = vehicleIncome - vehicleExpenses;
    const percent = vehicleIncome > 0 ? Math.max(0, Math.round((balance / vehicleIncome) * 100)) : 0;
    return {
      label: code || vehicle.model || "Vehiculo",
      income: vehicleIncome,
      expenses: vehicleExpenses,
      balance,
      loansOutstanding: vehicleLoans.outstanding,
      cash: balance - vehicleLoans.outstanding,
      percent
    };
  });
}

function profitRow(code, percent, balance = 0) {
  return `
    <div class="profit-row">
      <strong>${code}</strong>
      <span><i style="width:${percent}%"></i></span>
      <em>${percent}% - ${money(balance)}</em>
    </div>
  `;
}

function loanSummary(records = state.loans) {
  const lent = sum(records);
  const recovered = records.reduce((total, item) => total + Number(item.recovered_amount || 0), 0);
  const outstanding = Math.max(0, lent - recovered);
  const activeCount = records.filter((item) => {
    const status = item.status || loanStatus(item).label.toLowerCase();
    return !["pagado"].includes(status);
  }).length;
  return { lent, recovered, outstanding, activeCount };
}

function loanStatus(record) {
  const outstanding = Number(record.amount || 0) - Number(record.recovered_amount || 0);
  if (outstanding <= 0 || record.status === "pagado") return { key: "green", label: "Pagado" };
  const due = statusFromDate(record.due_date);
  if (due.key === "red") return { key: "red", label: "Vencido" };
  if (due.key === "yellow") return { key: "yellow", label: "Por vencer" };
  return { key: "gray", label: record.status === "parcial" ? "Parcial" : "Pendiente" };
}

function loanRow(record) {
  const outstanding = Math.max(0, Number(record.amount || 0) - Number(record.recovered_amount || 0));
  const status = loanStatus(record);
  return `
    <button class="list-row loan-row" data-edit-type="loans" data-id="${record.id}" type="button">
      <span>
        <strong>${record.borrower_name || "Prestamo"}</strong>
        <small>${record.vehicle_code || "Sin vehiculo"} - Prestado ${money(record.amount || 0)} - Recuperado ${money(record.recovered_amount || 0)}</small>
      </span>
      <span>
        <b>${money(outstanding)}</b>
        <em class="traffic ${status.key}">${status.label}</em>
      </span>
    </button>
  `;
}

function vehicleFinanceRow(row) {
  return `
    <article class="vehicle-finance-row">
      <header>
        <strong>${row.label}</strong>
        <span class="traffic ${row.balance >= 0 ? "green" : "red"}">${money(row.cash)} caja neta</span>
      </header>
      <div class="vehicle-finance-grid">
        <span><small>Ingresos</small><b>${money(row.income)}</b></span>
        <span><small>Gastos</small><b>${money(row.expenses)}</b></span>
        <span><small>Utilidad</small><b>${money(row.balance)}</b></span>
        <span><small>Prestamos</small><b>${money(row.loansOutstanding)}</b></span>
      </div>
      <div class="profit-row compact">
        <strong>${row.percent}%</strong>
        <span><i style="width:${row.percent}%"></i></span>
        <em>rentabilidad</em>
      </div>
    </article>
  `;
}

function renderFinance() {
  const income = sum(state.income);
  const expenses = sum(state.expenses);
  const balance = income - expenses;
  const vehicleRows = getVehicleProfitability();
  const loans = loanSummary();
  const cashEstimate = balance - loans.outstanding;
  $("#finance-view").innerHTML = `
    <div class="stats-grid finance-summary-grid">
      ${statCard("Ingresos operativos", money(income), "Rentas y pagos")}
      ${statCard("Egresos operativos", money(expenses), "Gastos reales")}
      ${statCard("Utilidad operativa", money(balance), "Ingresos - egresos")}
      ${statCard("Prestado", money(loans.lent), "Dinero entregado")}
      ${statCard("Recuperado", money(loans.recovered), "Dinero devuelto")}
      ${statCard("Por cobrar", money(loans.outstanding), "Saldo pendiente")}
      ${statCard("Caja disponible estimada", money(cashEstimate), "Utilidad - por cobrar")}
      ${statCard("Prestamos activos", loans.activeCount, "Pendientes/parciales")}
    </div>

    <section class="module-panel loan-summary-panel">
      <div class="panel-header">
        <div>
          <h3>Prestamos por cobrar</h3>
          <p>Separados de la utilidad operativa, pero visibles en caja estimada.</p>
        </div>
        <button class="primary-btn" data-create="loans" type="button">Agregar prestamo</button>
      </div>
      <div class="finance-list" data-grid="loans">
        ${state.loans.map((record) => loanRow(record)).join("") || `<div class="empty-state">Sin prestamos registrados.</div>`}
      </div>
    </section>

    <section class="module-panel profitability-card">
      <div class="panel-header">
        <div>
          <h3>Balance por coche</h3>
          <p>Utilidad operativa por coche y caja despues de prestamos pendientes.</p>
        </div>
      </div>
      <div class="vehicle-finance-list">
        ${vehicleRows.length ? vehicleRows.map(vehicleFinanceRow).join("") : `<div class="empty-state">Captura vehiculos e ingresos/egresos para calcular rentabilidad.</div>`}
      </div>
    </section>

    <div class="dashboard-layout">
      ${financePanel("income", "Ingresos", "Crear ingresos por vehiculo, chofer y periodo.")}
      ${financePanel("expenses", "Egresos", "Registrar gastos por vehiculo y categoria.")}
    </div>
  `;
  bindModule("income");
  bindModule("expenses");
  bindModule("loans");
}

function financePanel(type, title, subtitle) {
  return `
    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <button class="primary-btn" data-create="${type}" type="button">Agregar</button>
      </div>
      <div class="finance-list" data-grid="${type}">
        ${state[type].map((record) => financeRow(type, record)).join("") || `<div class="empty-state">Sin movimientos.</div>`}
      </div>
    </section>
  `;
}

function bindModule(type) {
  $$(`[data-create="${type}"]`).forEach((button) => button.addEventListener("click", () => openRecord(type)));
  $$(`[data-edit-type="${type}"]`).forEach((button) => button.addEventListener("click", () => openRecord(type, button.dataset.id)));
  if (type === "vehicles") {
    $$("[data-profile-id]").forEach((button) => button.addEventListener("click", () => openVehicleProfile(button.dataset.profileId)));
  }
  const search = $(`[data-search="${type}"]`);
  const filter = $(`[data-filter="${type}"]`);
  const clear = $(`[data-clear="${type}"]`);
  if (search) search.addEventListener("input", () => filterRecords(type));
  if (filter) filter.addEventListener("change", () => filterRecords(type));
  if (clear) clear.addEventListener("click", () => {
    search.value = "";
    filter.value = "";
    filterRecords(type);
  });
}

function filterRecords(type) {
  const query = ($(`[data-search="${type}"]`)?.value || "").toLowerCase();
  const color = $(`[data-filter="${type}"]`)?.value || "";
  const grid = $(`[data-grid="${type}"]`);
  const records = state[type].filter((record) => {
    const textMatch = JSON.stringify(record).toLowerCase().includes(query);
    const status = statusForRecord(type, record).key;
    return textMatch && (!color || status === color);
  });
  grid.innerHTML = records.map((record) => recordCard(type, record)).join("") || `<div class="empty-state">No hay coincidencias.</div>`;
  bindModule(type);
}

function recordCard(type, record) {
  const status = statusForRecord(type, record);
  const title = getTitle(type, record);
  const image = record.photo_url || record.file_url || record.receipt_url;
  return `
    <article class="record-card">
      <div class="record-media">${image ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" />` : initials(title)}</div>
      <div class="record-body">
        <h4>${title}</h4>
        <div class="record-meta">
          ${metaFor(type, record).map((line) => `<span>${line}</span>`).join("")}
        </div>
        <div class="badge-row">
          <span class="traffic ${status.key}">${status.label}</span>
          <span class="badge">${record.status || record.gps_status || record.document_name || record.service_type || "Registro"}</span>
          ${type === "vehicles" ? `<button class="small-btn" data-profile-id="${record.id}" type="button">Ficha</button>` : ""}
          <button class="small-btn" data-edit-type="${type}" data-id="${record.id}" type="button">Editar</button>
        </div>
      </div>
    </article>
  `;
}

function financeRow(type, record) {
  const amount = Number(record.amount || 0);
  return `
    <button class="list-row" data-edit-type="${type}" data-id="${record.id}" type="button">
      <span>
        <strong>${record.concept || "Movimiento"}</strong>
        <small>${record.vehicle_code || "Sin vehiculo"} - ${record.date || "Sin fecha"}</small>
      </span>
      <span class="traffic ${type === "income" ? "green" : "red"}">${money(amount)}</span>
    </button>
  `;
}

function bindDialog() {
  $("#close-dialog").addEventListener("click", () => $("#record-dialog").close());
  $("#delete-record").addEventListener("click", async () => {
    if (!activeRecordId || !confirm("Confirma que deseas eliminar este registro.")) return;
    state[activeRecordType] = state[activeRecordType].filter((item) => item.id !== activeRecordId);
    await deleteRemote(activeRecordType, activeRecordId);
    persist();
    $("#record-dialog").close();
    renderAll();
  });
  $("#record-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const record = {};
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("__file_")) record[key] = value;
    }
    record.id = activeRecordId || crypto.randomUUID();
    for (const field of fieldSets[activeRecordType]) {
      if (field[2] === "date" || field[2] === "datetime-local") {
        record[field[0]] = record[field[0]] || null;
      }
      if (field[2] === "number") {
        const shouldDefaultZero = ["amount", "cost"].includes(field[0]);
        record[field[0]] = record[field[0]] === "" ? (shouldDefaultZero ? 0 : null) : Number(record[field[0]]);
      }
      if (field[2] === "file") {
        const file = formData.get(field[0]);
        if (file && file.name) {
          const publicUrl = await uploadRemoteFile(field[3], file);
          if (publicUrl) record[field[4]] = publicUrl;
        }
      }
    }

    const saved = await upsertRemote(activeRecordType, record);
    if (!saved) return;

    await syncFromSupabase();
    const existingIndex = state[activeRecordType].findIndex((item) => item.id === record.id);
    if (existingIndex >= 0) {
      state[activeRecordType][existingIndex] = { ...state[activeRecordType][existingIndex], ...record };
    } else if (!hasSupabase) {
      state[activeRecordType].push(record);
    }
    persist();
    $("#record-dialog").close();
    renderAll();
    alert("Guardado correctamente.");
  });
}

function openRecord(type, id = null) {
  activeRecordType = type;
  activeRecordId = id;
  const record = id ? state[type].find((item) => item.id === id) : {};
  $("#dialog-title").textContent = `${id ? "Editar" : "Nuevo"} ${labelForType(type)}`;
  $("#delete-record").classList.toggle("is-hidden", !id);
  $("#dialog-fields").innerHTML = fieldSets[type].map((field) => inputForField(field, record)).join("");
  $("#record-dialog").showModal();
}

function bindVehicleProfileDialog() {
  $("#close-profile-dialog")?.addEventListener("click", () => $("#vehicle-profile-dialog").close());
}

function openVehicleProfile(id) {
  const vehicle = state.vehicles.find((item) => item.id === id);
  if (!vehicle) return;
  const code = vehicleKey(vehicle);
  const finances = getVehicleProfitability().find((row) => row.label === code) || {
    income: 0,
    expenses: 0,
    balance: 0,
    loansOutstanding: 0,
    cash: 0,
    percent: 0
  };
  const driver = state.drivers.find((item) => item.vehicle_assigned === code || item.full_name === vehicle.driver_name);
  const gps = state.gps.find((item) => item.vehicle_code === code);
  const movements = [
    ...state.income.filter((item) => item.vehicle_code === code).map((item) => ({ ...item, kind: "Ingreso" })),
    ...state.expenses.filter((item) => item.vehicle_code === code).map((item) => ({ ...item, kind: "Egreso" }))
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 6);

  $("#vehicle-profile-title").textContent = `Ficha - ${code || "Vehiculo"}`;
  $("#vehicle-profile-body").innerHTML = `
    <section class="profile-hero">
      <div>
        <strong>${escapeHtml(vehicle.brand || "Unidad")} ${escapeHtml(vehicle.model || "")}</strong>
        <span>${escapeHtml(vehicle.plates || "Sin placas")} - ${escapeHtml(vehicle.status || "Sin estatus")}</span>
      </div>
      <span class="traffic ${vehicleCalendarStatus(vehicle).key}">${vehicleCalendarStatus(vehicle).label}</span>
    </section>

    <div class="profile-grid">
      <article class="profile-box">
        <h4>Datos del coche</h4>
        ${profileLine("Codigo", code || "Sin codigo")}
        ${profileLine("Tipo", vehicle.unit_type || "Sin tipo")}
        ${profileLine("Anio", vehicle.year || "Sin anio")}
        ${profileLine("Color", vehicle.color || "Sin color")}
        ${profileLine("VIN", vehicle.vin || "Sin VIN")}
      </article>

      <article class="profile-box">
        <h4>Chofer y GPS</h4>
        ${profileLine("Chofer", driver?.full_name || vehicle.driver_name || "Sin asignar")}
        ${profileLine("Telefono", driver?.phone || "Sin telefono")}
        ${profileLine("GPS", gps?.gps_name || "Sin unidad GPS")}
        ${profileLine("Conexion", gps?.last_connection || "Sin dato")}
      </article>

      <article class="profile-box profile-box-wide">
        <h4>Calendario</h4>
        <div class="profile-calendar">
          ${vehicleCalendarRows(vehicle)}
        </div>
      </article>

      <article class="profile-box profile-box-wide">
        <h4>Finanzas del coche</h4>
        <div class="vehicle-finance-grid">
          <span><small>Ingresos</small><b>${money(finances.income)}</b></span>
          <span><small>Gastos</small><b>${money(finances.expenses)}</b></span>
          <span><small>Utilidad</small><b>${money(finances.balance)}</b></span>
          <span><small>Caja disponible</small><b>${money(finances.cash)}</b></span>
          <span><small>Prestamos por cobrar</small><b>${money(finances.loansOutstanding)}</b></span>
          <span><small>Rentabilidad</small><b>${finances.percent}%</b></span>
        </div>
      </article>

      <article class="profile-box profile-box-wide">
        <h4>Ultimos movimientos</h4>
        <div class="finance-list">
          ${movements.length ? movements.map(profileMovementRow).join("") : `<div class="empty-state">Sin movimientos para este coche.</div>`}
        </div>
      </article>

      <article class="profile-box profile-box-wide">
        <h4>Servicios y notas</h4>
        ${profileLine("Proximo servicio", vehicle.next_service_date || "Sin fecha")}
        ${profileLine("Notas de servicio", vehicle.service_notes || "Sin notas")}
        ${profileLine("Notas generales", vehicle.notes || "Sin notas")}
      </article>
    </div>
  `;
  $("#vehicle-profile-dialog").showModal();
}

function profileLine(label, value) {
  return `<p class="profile-line"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></p>`;
}

function vehicleCalendarRows(vehicle) {
  const rows = [
    ["Seguro", vehicle.insurance_expires_at],
    ["Tarjeta", vehicle.registration_expires_at],
    ["Verificacion", vehicle.verification_expires_at],
    ["Tenencia", vehicle.tax_expires_at],
    ["GPS", vehicle.gps_expires_at],
    ["Servicio", vehicle.next_service_date]
  ];
  const html = rows.map(([label, dateValue]) => {
    const status = statusFromDate(dateValue);
    return `
      <div class="profile-calendar-row">
        <span>${label}</span>
        <strong>${dateValue || "Sin fecha"}</strong>
        <em class="traffic ${status.key}">${status.label}</em>
      </div>
    `;
  }).join("");
  return html;
}

function profileMovementRow(record) {
  return `
    <div class="list-row">
      <span>
        <strong>${escapeHtml(record.concept || record.kind)}</strong>
        <small>${escapeHtml(record.kind)} - ${escapeHtml(record.date || "Sin fecha")}</small>
      </span>
      <span class="traffic ${record.kind === "Ingreso" ? "green" : "red"}">${money(record.amount || 0)}</span>
    </div>
  `;
}

function inputForField([name, label, type, options], record = {}) {
  const value = record[name] || "";
  const full = type === "textarea" ? " full" : "";
  if (type === "textarea") {
    return `<label class="${full}">${label}<textarea name="${name}">${escapeHtml(value)}</textarea></label>`;
  }
  if (type === "vehicle-select") {
    const vehicleOptions = state.vehicles.map((vehicle) => vehicleKey(vehicle)).filter(Boolean);
    return `
      <label>${label}
        <select name="${name}">
          <option value="">Seleccionar vehiculo</option>
          ${vehicleOptions.map((option) => `<option value="${escapeAttr(option)}" ${value === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (type === "file") {
    return `<label>${label}<input name="${name}" type="file" /></label>`;
  }
  if (type === "select") {
    return `
      <label>${label}
        <select name="${name}">
          <option value="">Seleccionar</option>
          ${options.map((option) => `<option value="${option}" ${value === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </label>
    `;
  }
  return `<label>${label}<input name="${name}" type="${type}" value="${escapeAttr(value)}" /></label>`;
}

function vehicleKey(vehicle) {
  return vehicle.internal_code || vehicle.plates || [vehicle.brand, vehicle.model].filter(Boolean).join(" ").trim();
}

async function syncFromSupabase() {
  if (!hasSupabase) return;
  for (const [key, table] of Object.entries(tableMap)) {
    const { data, error } = await supabaseClient.from(table).select("*").order("created_at", { ascending: false });
    if (error) {
      alert(`No se pudieron cargar datos de ${table}: ${error.message}`);
    } else if (Array.isArray(data)) {
      state[key] = data;
    }
  }
  persist();
}

async function upsertRemote(type, record) {
  if (!hasSupabase) return true;
  const table = tableMap[type];
  if (!table) return false;
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session?.user?.id) {
    alert("Tu sesion expiro. Inicia sesion otra vez antes de guardar.");
    return false;
  }
  if (sessionData.session?.user?.id && !record.user_id) {
    record.user_id = sessionData.session.user.id;
  }
  const { error } = await supabaseClient.from(table).upsert(record);
  if (error) {
    alert(`No se pudo guardar en Supabase: ${error.message}`);
    return false;
  }
  return true;
}

async function deleteRemote(type, id) {
  if (!hasSupabase) return;
  const table = tableMap[type];
  if (!table) return;
  const { error } = await supabaseClient.from(table).delete().eq("id", id);
  if (error) alert(`No se pudo eliminar en Supabase: ${error.message}`);
}

async function uploadRemoteFile(bucket, file) {
  if (!hasSupabase) {
    alert("Configura Supabase para subir archivos reales. En modo revision puedes pegar una URL publica.");
    return "";
  }
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  if (sessionError || !sessionData.session) {
    alert("Inicia sesion para subir archivos a Supabase Storage.");
    return "";
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${sessionData.session.user.id}/${Date.now()}-${safeName}`;
  const { error } = await supabaseClient.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) {
    alert(`No se pudo subir el archivo: ${error.message}`);
    return "";
  }
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function statusForRecord(type, record) {
  if (type === "vehicles") return vehicleCalendarStatus(record);
  if (type === "documents") return statusFromDate(record.expires_at);
  if (type === "services") return statusFromDate(record.next_service_date);
  if (type === "gps") return statusFromDate(record.expires_at);
  if (type === "drivers") return statusFromDate(record.license_expiration);
  if (type === "loans") return loanStatus(record);
  return record.status === "activo" || record.status === "disponible" ? { key: "green", label: "Vigente" } : { key: "gray", label: "Sin fecha" };
}

function vehicleCalendarStatus(vehicle) {
  const statuses = [
    vehicle.insurance_expires_at,
    vehicle.registration_expires_at,
    vehicle.verification_expires_at,
    vehicle.tax_expires_at,
    vehicle.gps_expires_at,
    vehicle.next_service_date
  ].filter(Boolean).map(statusFromDate);
  if (statuses.some((status) => status.key === "red")) return { key: "red", label: "Vencido" };
  if (statuses.some((status) => status.key === "yellow")) return { key: "yellow", label: "Proximo" };
  if (statuses.some((status) => status.key === "green")) return { key: "green", label: "Vigente" };
  return recordStatus(vehicle);
}

function recordStatus(record) {
  return record.status === "activo" || record.status === "disponible" ? { key: "green", label: "Vigente" } : { key: "gray", label: "Sin fecha" };
}

function statusFromDate(dateValue) {
  if (!dateValue) return { key: "gray", label: "Sin fecha" };
  const date = new Date(dateValue);
  const days = Math.ceil((date - today) / 86400000);
  if (days < 0) return { key: "red", label: "Vencido" };
  if (days <= 30) return { key: "yellow", label: "Proximo" };
  return { key: "green", label: "Vigente" };
}

function collectAlerts() {
  const items = [];
  state.vehicles.forEach((vehicle) => {
    [
      ["Seguro", vehicle.insurance_expires_at],
      ["Tarjeta de circulacion", vehicle.registration_expires_at],
      ["Verificacion", vehicle.verification_expires_at],
      ["Tenencia", vehicle.tax_expires_at],
      ["GPS", vehicle.gps_expires_at],
      ["Servicio", vehicle.next_service_date]
    ].forEach(([label, dateValue]) => {
      if (!dateValue) return;
      items.push({
        title: `${label} - ${vehicleKey(vehicle) || "Vehiculo"}`,
        detail: vehicle.model || vehicle.plates || "Calendario del vehiculo",
        status: statusFromDate(dateValue)
      });
    });
  });
  state.gps.forEach((record) => items.push({
    title: record.gps_name || "GPS",
    detail: record.vehicle_code || "Sin vehiculo",
    status: statusFromDate(record.expires_at)
  }));
  state.drivers.forEach((record) => items.push({
    title: record.full_name || "Chofer",
    detail: "Licencia",
    status: statusFromDate(record.license_expiration)
  }));
  return items.filter((item) => ["yellow", "red"].includes(item.status.key));
}

function alertRow(item) {
  return `
    <div class="list-row">
      <span>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </span>
      <span class="traffic ${item.status.key}">${item.status.label}</span>
    </div>
  `;
}

function statCard(label, value, detail) {
  return `
    <article class="stat-card">
      <p>${label}</p>
      <strong>${value}</strong>
      <small>${detail}</small>
    </article>
  `;
}

function barRow(label, value, max, className) {
  const width = Math.min(100, Math.round((value / max) * 100));
  return `
    <div class="bar-row">
      <span><b>${label}</b><b>${money(value)}</b></span>
      <div class="bar-track"><div class="bar-fill ${className}" style="width:${width}%"></div></div>
    </div>
  `;
}

function metaFor(type, record) {
  const map = {
    vehicles: [`Placas: ${record.plates || "N/D"}`, `Modelo: ${record.model || "N/D"}`, `Chofer: ${record.driver_name || "Sin asignar"}`, `Prox. servicio: ${record.next_service_date || "Sin fecha"}`],
    drivers: [`Telefono: ${record.phone || "N/D"}`, `Vehiculo: ${record.vehicle_assigned || "Sin asignar"}`, `Licencia: ${record.license_expiration || "Sin fecha"}`],
    documents: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Vence: ${record.expires_at || "Sin fecha"}`],
    services: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Proximo: ${record.next_service_date || "Sin fecha"}`, `Costo: ${money(record.cost || 0)}`],
    gps: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Conexion: ${record.last_connection || "Sin dato"}`, `Vence: ${record.expires_at || "Sin fecha"}`]
  };
  return map[type] || [];
}

function getTitle(type, record) {
  if (type === "vehicles") return `${record.internal_code || "Unidad"} - ${record.brand || ""} ${record.model || ""}`.trim();
  if (type === "drivers") return record.full_name || "Chofer";
  if (type === "documents") return record.document_name || "Documento";
  if (type === "services") return record.service_type || "Servicio";
  if (type === "gps") return record.gps_name || "Unidad GPS";
  if (type === "loans") return record.borrower_name || "Prestamo";
  return record.concept || "Registro";
}

function labelForType(type) {
  return {
    vehicles: "vehiculo",
    drivers: "chofer",
    documents: "documento",
    services: "servicio",
    gps: "GPS",
    income: "ingreso",
    expenses: "egreso",
    loans: "prestamo"
  }[type];
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}

function persist() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function sum(records) {
  return records.reduce((total, item) => total + Number(item.amount || 0), 0);
}

function money(value) {
  return Number(value || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function isoDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function initials(text) {
  return String(text || "LB").split(/\s|-/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

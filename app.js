const CONFIG = window.LABESA_CONFIG || {};
const hasSupabase = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && window.supabase);
const supabaseClient = hasSupabase
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

const STORE_KEY = "labesa-movilidad-local";
const THEME_KEY = "labesa-movilidad-theme";
const WIALON_STORE_KEY = "labesa-wialon-config";
const today = new Date();
const verificationSchedule = {
  amarillo: { first: [1, 2], second: [7, 8], plates: "5 y 6" },
  rosa: { first: [2, 3], second: [8, 9], plates: "7 y 8" },
  rojo: { first: [3, 4], second: [9, 10], plates: "3 y 4" },
  verde: { first: [4, 5], second: [10, 11], plates: "1 y 2" },
  azul: { first: [5, 6], second: [11, 12], plates: "9 y 0" }
};

const modules = [
  { id: "dashboard", title: "Inicio", icon: "home" },
  { id: "vehicles", title: "Vehiculos", icon: "car" },
  { id: "admin", title: "Administracion", icon: "shield" },
  { id: "gps", title: "GPS", icon: "globe" },
  { id: "finance", title: "Finanzas", icon: "money" },
  { id: "drivers", title: "Choferes", icon: "user" },
  { id: "services", title: "Servicios mecanicos", icon: "tool" }
];

const tableMap = {
  vehicles: "vehicles",
  drivers: "drivers",
  documents: "vehicle_documents",
  services: "services",
  mileage_logs: "mileage_logs",
  gps: "gps_units",
  income: "income",
  expenses: "expenses",
  loans: "loans"
};

const fieldSets = {
  vehicles: [
    ["internal_code", "Codigo interno", "text"],
    ["brand", "Marca", "text"],
    ["model", "Modelo", "text"],
    ["color", "Color", "text"],
    ["plates", "Placas", "text"],
    ["vin", "Numero de serie / VIN", "text"],
    ["driver_name", "Chofer asignado", "driver-select"],
    ["status", "Estatus", "select", ["activo", "inactivo", "taller", "disponible", "rentado"]],
    ["photo_url", "Foto del coche (URL publica)", "url"],
    ["__file_photo_url", "Subir foto del coche", "file", "vehicle-photos", "photo_url"],
    ["notes", "Notas generales", "textarea"]
  ],
  vehicle_admin: [
    ["verification_sticker", "Engomado", "sticker-select"],
    ["first_verification_due", "Verificacion primer semestre", "date"],
    ["first_verification_status", "Estatus primer semestre", "select", ["pendiente", "verificado"]],
    ["second_verification_due", "Verificacion segundo semestre", "date"],
    ["second_verification_status", "Estatus segundo semestre", "select", ["pendiente", "verificado"]],
    ["registration_expires_at", "Vencimiento tarjeta de circulacion", "date"],
    ["tax_expires_at", "Vencimiento refrendo / tenencia", "date"],
    ["insurance_expires_at", "Vencimiento de seguro", "date"],
    ["gps_expires_at", "Vencimiento GPS", "date"],
    ["circulation_card_photo_url", "Tarjeta de circulacion (URL publica)", "url"],
    ["__file_circulation_card_photo_url", "Subir foto de tarjeta de circulacion", "file", "vehicle-documents", "circulation_card_photo_url", "image/*"],
    ["plates_photo_url", "Placas (URL publica)", "url"],
    ["__file_plates_photo_url", "Subir foto de placas", "file", "vehicle-documents", "plates_photo_url", "image/*"],
    ["insurance_policy_photo_url", "Poliza de seguro (URL publica)", "url"],
    ["__file_insurance_policy_photo_url", "Subir PDF de poliza de seguro", "file", "vehicle-documents", "insurance_policy_photo_url", ".pdf,application/pdf"],
    ["notes", "Observaciones administrativas", "textarea"]
  ],
  drivers: [
    ["internal_code", "Codigo interno", "text"],
    ["full_name", "Nombre completo", "text"],
    ["phone", "Telefono", "tel"],
    ["address", "Direccion", "textarea"],
    ["ine", "INE", "text"],
    ["ine_photo_url", "Foto INE (URL publica)", "url"],
    ["__file_ine_photo_url", "Subir foto INE", "file", "driver-photos", "ine_photo_url", "image/*"],
    ["license", "Licencia", "text"],
    ["license_photo_url", "Foto licencia (URL publica)", "url"],
    ["__file_license_photo_url", "Subir foto de licencia", "file", "driver-photos", "license_photo_url", "image/*"],
    ["contract_start", "Inicio de contrato", "date"],
    ["vehicle_assigned", "Vehiculo asignado", "vehicle-select"],
    ["photo_url", "Foto del chofer (URL publica)", "url"],
    ["__file_photo_url", "Subir foto del chofer", "file", "driver-photos", "photo_url"],
    ["status", "Estatus", "select", ["activo", "inactivo", "suspendido"]],
    ["notes", "Notas", "textarea"]
  ],
  driver_admin: [
    ["license_expiration", "Vencimiento de licencia", "date"],
    ["license_photo_url", "Licencia del chofer (URL publica)", "url"],
    ["__file_license_photo_url", "Subir foto de licencia", "file", "driver-photos", "license_photo_url", "image/*"],
    ["contract_end", "Termino de contrato", "date"],
    ["contract_renewal_date", "Renovacion de contrato", "date"],
    ["contract_file_url", "Contrato o responsiva (URL publica)", "url"],
    ["__file_contract_file_url", "Subir PDF contrato/responsiva", "file", "driver-photos", "contract_file_url", ".pdf,application/pdf"],
    ["notes", "Observaciones administrativas", "textarea"]
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
    ["service_type", "Tipo de servicio", "select", ["reparacion", "refaccion", "mantenimiento", "revision", "otro"]],
    ["service_date", "Fecha de reparacion o revision", "date"],
    ["next_service_date", "Proxima revision", "date"],
    ["provider", "Taller o proveedor", "text"],
    ["cost", "Costo", "number"],
    ["status", "Estatus", "select", ["pendiente", "programado", "realizado", "cancelado"]],
    ["notes", "Descripcion del servicio", "textarea"]
  ],
  mileage_logs: [
    ["vehicle_code", "Vehiculo", "vehicle-select"],
    ["reading_date", "Fecha de entrada", "date"],
    ["kilometers", "Kilometraje", "number"],
    ["reason", "Motivo de entrada", "text"],
    ["notes", "Observaciones", "textarea"]
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
    ["finance_bucket", "Modulo financiero", "select", ["renta", "inversion", "otro_ingreso"]],
    ["finance_subcategory", "Subcategoria", "text"],
    ["classification_status", "Clasificacion", "select", ["auto", "manual", "revision"]],
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
    ["finance_bucket", "Modulo financiero", "select", ["mantenimiento", "activo", "otro_egreso"]],
    ["finance_subcategory", "Subcategoria", "text"],
    ["classification_status", "Clasificacion", "select", ["auto", "manual", "revision"]],
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
  mileage_logs: [],
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
let activeFieldSetType = null;
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
  restoreSession();
  if (!hasSupabase) {
    $("#auth-message").textContent = "Modo revision: agrega credenciales Supabase en config.js para datos reales.";
  }
}

async function restoreSession() {
  if (!hasSupabase) return;
  const { data } = await supabaseClient.auth.getSession();
  if (data.session?.user?.id) {
    await syncFromSupabase();
    showApp();
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
  $("#app-shell").dataset.activeView = activeView;
  renderAll();
}

function renderNavigation() {
  const markup = modules.map((item) => navButton(item)).join("");
  const mobileItems = modules;
  $("#main-menu").innerHTML = markup;
  $("#bottom-nav").innerHTML = mobileItems.map((item) => navButton(item)).join("");
  $$(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
}

function navButton(item) {
  return `
    <button class="nav-btn ${activeView === item.id ? "active" : ""}" data-view="${item.id}" type="button">
      <span class="nav-icon">${navIcon(item.icon)}</span>
      <span>${item.title.replace(" general", "")}</span>
    </button>
  `;
}

function navIcon(name) {
  const icons = {
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4z"/></svg>`,
    car: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11 7 6h10l2 5 1 1v6h-3v-2H7v2H4v-6zm3.3-3-1.1 3h9.6l-1.1-3zM7 14.5A1.5 1.5 0 1 0 7 17.5a1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm6.6 8h-3.1a14.8 14.8 0 0 0-1.2-5.1A7 7 0 0 1 18.6 11zM12 5.1c.7 1.1 1.3 3.1 1.5 5.9h-3c.2-2.8.8-4.8 1.5-5.9zM5.4 13h3.1c.1 2 .5 3.8 1.2 5.1A7 7 0 0 1 5.4 13zm3.1-2H5.4a7 7 0 0 1 4.3-5.1A14.8 14.8 0 0 0 8.5 11zm3.5 7.9c-.7-1.1-1.3-3.1-1.5-5.9h3c-.2 2.8-.8 4.8-1.5 5.9zm2.3-.8c.7-1.3 1.1-3.1 1.2-5.1h3.1a7 7 0 0 1-4.3 5.1z"/></svg>`,
    money: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3v2.1c1.7.3 3 1.2 4 2.5l-2 1.5c-.8-1-1.7-1.5-3-1.5-1.2 0-2 .5-2 1.3 0 .9.8 1.2 2.8 1.7 2.7.7 4.5 1.7 4.5 4.2 0 2.2-1.7 3.8-4.3 4.2V21h-2v-2c-2-.3-3.6-1.4-4.7-3l2.1-1.4c.9 1.2 2 1.8 3.6 1.8 1.5 0 2.3-.6 2.3-1.5 0-.8-.6-1.2-2.7-1.7-2.7-.7-4.6-1.7-4.6-4.2 0-2.1 1.6-3.6 4-3.9V3z"/></svg>`,
    user: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.4-8 5.3V21h16v-1.7c0-2.9-3.6-5.3-8-5.3z"/></svg>`,
    tool: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7.2a6.4 6.4 0 0 1-7.8 7.8l-6.4 6.4-4.2-4.2L9 10.8A6.4 6.4 0 0 1 16.8 3l-4 4 4.2 4.2z"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22zm7-6v-5.4A7 7 0 0 0 14 4V2h-4v2a7 7 0 0 0-5 6.6V16l-2 2v1h18v-1z"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 1.8 20h20.4zM11 8h2v6h-2zm0 8h2v2h-2z"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7-1.4-1.4 5.6-5.6-5.6-5.6z"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2h-4l-.4 2.5A8 8 0 0 0 7 6L4.6 5l-2 3.5 2 1.5A8 8 0 0 0 4.5 12c0 .5 0 1 .1 1.5l-2 1.5 2 3.5L7 17a8 8 0 0 0 2.6 1.5L10 21h4l.4-2.5A8 8 0 0 0 17 17l2.4 1 2-3.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5zm-1 13.5-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.7 1.4 1.4z"/></svg>`,
    chart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16v2H2V4h2zm3-2h3V9H7zm5 0h3V5h-3zm5 0h3v-7h-3z"/></svg>`,
    wallet: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A3.5 3.5 0 0 1 6.5 3H20v4H6.5a1.5 1.5 0 0 0 0 3H22v10H5a3 3 0 0 1-3-3V6.5zm15 8.5a1.5 1.5 0 1 0 0 3h2v-3z"/></svg>`,
    file: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h9l5 5v13H5zm8 1.8V9h4.2zM8 12h8v2H8zm0 4h8v2H8z"/></svg>`,
    "user-plus": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2.1-7 5v1h12v-1c0-1.5.7-2.9 1.8-3.8A12.5 12.5 0 0 0 9 14zm10-1v3h3v2h-3v3h-2v-3h-3v-2h3v-3z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v3h6V2h2v3h3v16H4V5h3zm11 8H6v9h12z"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17.2V20h2.8L17.7 9.1l-2.8-2.8zm15.8-10L18.7 8.3l-2.8-2.8 1.1-1.1a1.3 1.3 0 0 1 1.8 0l1 1a1.3 1.3 0 0 1 0 1.8z"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>`
  };
  return icons[name] || name;
}

function switchView(view) {
  activeView = view;
  $("#app-shell").dataset.activeView = activeView;
  $$(".view").forEach((section) => section.classList.remove("active-view"));
  $(`#${view}-view`).classList.add("active-view");
  $("#view-title").textContent = modules.find((item) => item.id === view).title;
  renderNavigation();
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderModule("vehicles", "Vehiculos registrados", "Busca, filtra y administra cada unidad.");
  renderAdminModule();
  renderModule("drivers", "Choferes", "Licencias, estatus y asignaciones.");
  renderModule("services", "Servicios mecanicos", "Historial por coche, fecha y kilometraje.");
  renderModule("gps", "GPS / Wialon", "Preparado para integracion con API de Wialon.");
  renderFinance();
}

function renderDashboard() {
  const activeVehicles = state.vehicles.filter((v) => v.status === "activo").length;
  const alertItems = collectAlerts();
  const finance = financeTotals();
  const greeting = greetingForTime();
  const alertTarget = dashboardAlertTargetView();

  $("#dashboard-view").innerHTML = `
    <section class="dashboard-intro">
      <div class="intro-copy">
        <p>${greeting} ðŸ‘‹</p>
        <h3>LaBeSa Movilidad</h3>
        <span>Inicio</span>
      </div>
      <img class="intro-logo" src="assets/logo-labesa-app.png" alt="LaBeSa Movilidad" />
    </section>

    <section class="alert-summary-card">
      <div class="alert-summary-icon">${navIcon("alert")}</div>
      <div>
        <h3>Alertas prioritarias</h3>
        <p>${alertItems.length ? `Tienes ${alertItems.length} alerta${alertItems.length === 1 ? "" : "s"} activa${alertItems.length === 1 ? "" : "s"} que requieren atencion.` : "No hay vencimientos criticos por ahora."}</p>
      </div>
      <button class="ghost-btn alert-summary-action" data-view="${alertTarget}" data-alert-shortcut="true" type="button">Ver alertas ${navIcon("chevron")}</button>
    </section>

    <section class="fleet-hero-card">
      <button class="fleet-hero-button" data-view="vehicles" type="button" aria-label="Ver mi flotilla"></button>
    </section>

    <div class="section-title-row premium-section-title">
      <h3>Resumen operativo</h3>
      <span class="date-chip">${navIcon("calendar")} ${new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" }).format(today)}</span>
    </div>

    <div class="stats-grid operational-grid premium-stats-grid">
      ${premiumStatCard("Vehiculos", state.vehicles.length, `${activeVehicles} activos`, "car", "teal", "vehicles")}
      ${premiumStatCard("Conductores", state.drivers.length, "capturados", "user", "purple", "drivers")}
      ${premiumStatCard("Calendario", alertItems.length, "proximos eventos", "calendar", "blue", "admin")}
      ${premiumStatCard("Liquidez", money(finance.liquidez), "caja disponible", "money", "green", "finance")}
    </div>

    <section class="module-panel premium-actions-panel">
      <div class="panel-header">
        <div>
          <h3>Acciones rapidas</h3>
          <p>Atajos para operar sin perder tiempo</p>
        </div>
      </div>
      <div class="quick-grid premium-actions-grid">
        ${quickAction("Agregar vehiculo", "vehicles", "plus", "vehicles", "teal")}
        ${quickAction("Nuevo conductor", "drivers", "user-plus", "drivers", "purple")}
        ${quickAction("Nuevo evento", "services", "calendar", "services", "blue")}
        ${quickAction("Registrar ingreso", "finance", "file", "income", "green")}
      </div>
    </section>

  `;
  $$("#dashboard-view [data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
      if (button.dataset.alertShortcut === "true" && button.dataset.view === "services") {
        const filter = $(`[data-filter="services"]`);
        if (filter) {
          filter.value = "priority";
          filterRecords("services");
        }
      }
      if (button.dataset.quickCreate) openRecord(button.dataset.quickCreate);
    })
  );
}

function dashboardAlertTargetView() {
  return "admin";
}

function greetingForTime(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Â¡Buenos dias!";
  if (hour < 19) return "Â¡Buenas tardes!";
  return "Â¡Buenas noches!";
}

function premiumStatCard(label, value, detail, icon, tone, view = "") {
  const viewAttr = view ? ` data-view="${view}"` : "";
  return `
    <button class="stat-card premium-stat-card tone-${tone}"${viewAttr} type="button">
      <span class="premium-stat-icon">${navIcon(icon)}</span>
      <p>${label}</p>
      <strong>${value}</strong>
      <small>${detail}</small>
      <span class="stat-sparkline" aria-hidden="true"></span>
    </button>
  `;
}

function quickAction(label, view, icon, createType = "", tone = "teal") {
  const createAttr = createType ? ` data-quick-create="${createType}"` : "";
  return `
    <button class="quick-card premium-action-card tone-${tone}" data-view="${view}"${createAttr} type="button">
      <span>${navIcon(icon)}</span>
      ${label}
    </button>
  `;
}

function alertTicker(alertItems) {
  if (!alertItems.length) return "";
  const text = alertItems
    .slice(0, 8)
    .map((item) => `${item.status.label}: ${item.title}`)
    .join("   |   ");
  return `
    <section class="alert-ticker" aria-label="Alertas prioritarias">
      <strong>Alertas prioritarias</strong>
      <div><span>${escapeHtml(text)}</span></div>
    </section>
  `;
}

function renderModule(type, title, subtitle) {
  if (type === "vehicles") {
    renderVehiclesModule(title, subtitle);
    return;
  }
  if (type === "gps") {
    renderGpsModule(title, subtitle);
    return;
  }
  if (type === "services") {
    renderServicesModule(title, subtitle);
    return;
  }
  if (type === "drivers") {
    renderDriversModule(title, subtitle);
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

function renderDriversModule(title, subtitle) {
  const records = state.drivers || [];
  const view = $("#drivers-view");
  view.innerHTML = `
    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <button class="primary-btn" data-create="drivers" type="button">Agregar</button>
      </div>
      <div class="records-grid" data-grid="drivers">
        ${records.map((record) => recordCard("drivers", record)).join("") || `<div class="empty-state">No hay choferes todavia.</div>`}
      </div>
    </section>
  `;
  bindModule("drivers");
}

function renderVehiclesModule(title, subtitle) {
  const records = state.vehicles || [];
  const view = $("#vehicles-view");
  view.innerHTML = `
    <section class="vehicles-clean-view">
      <header class="clean-view-header">
        <div>
          <h2>Vehiculos</h2>
          <p>Administra y consulta cada unidad registrada.</p>
        </div>
        <button class="primary-btn compact-add-btn" data-create="vehicles" type="button">Agregar</button>
      </header>

      <div class="vehicles-clean-list" data-grid="vehicles">
        ${records.map(vehicleCleanCard).join("") || `<div class="empty-state">No hay vehiculos todavia.</div>`}
      </div>
    </section>
  `;
  bindModule("vehicles");
}

function vehicleCleanCard(record) {
  const status = statusForRecord("vehicles", record);
  const title = `${record.internal_code || "Unidad"} - ${[record.brand, record.model, record.year].filter(Boolean).join(" ")}`.trim();
  const image = record.photo_url;
  const driver = record.driver_name || "Sin chofer asignado";
  return `
    <article class="vehicle-clean-card">
      <div class="vehicle-clean-photo">${image ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" />` : initials(title)}</div>
      <div class="vehicle-clean-body">
        <h3>${escapeHtml(title)}</h3>
        <p><strong>Chofer:</strong> ${escapeHtml(driver)}</p>
        <div class="vehicle-clean-actions">
          <span class="traffic ${status.key}">${status.label}</span>
          <span class="badge">${escapeHtml(record.status || "Registro")}</span>
          <button class="small-btn" data-profile-id="${record.id}" type="button">${navIcon("file")} Ficha</button>
          <button class="small-btn" data-edit-type="vehicles" data-id="${record.id}" type="button">${navIcon("edit")} Editar</button>
        </div>
      </div>
    </article>
  `;
}

function renderAdminModule() {
  const alerts = collectAlerts();
  const vehicles = state.vehicles || [];
  const drivers = state.drivers || [];
  const view = $("#admin-view");
  view.innerHTML = `
    <section class="module-panel admin-hero-panel">
      <div class="panel-header">
        <div>
          <h3>Administracion</h3>
          <p>Vencimientos, documentos y pendientes por coche y chofer.</p>
        </div>
        <span class="traffic ${alerts.length ? "yellow" : "green"}">${alerts.length ? `${alerts.length} alerta${alerts.length === 1 ? "" : "s"}` : "Todo en orden"}</span>
      </div>
      <div class="finance-list admin-alert-list">
        ${alerts.length ? alerts.slice(0, 8).map(alertRow).join("") : `<div class="empty-state">No hay documentos vencidos ni proximos a vencer.</div>`}
      </div>
    </section>

    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>Documentos por vehiculo</h3>
          <p>Verificacion, tarjeta, placas, seguro, tenencia y GPS.</p>
        </div>
      </div>
      <div class="admin-card-grid">
        ${vehicles.length ? vehicles.map(adminVehicleCard).join("") : `<div class="empty-state">Agrega vehiculos para administrar sus documentos.</div>`}
      </div>
    </section>

    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>Documentos de choferes</h3>
          <p>Licencias, contratos y responsivas.</p>
        </div>
      </div>
      <div class="admin-card-grid">
        ${drivers.length ? drivers.map(adminDriverCard).join("") : `<div class="empty-state">Agrega choferes para administrar sus documentos.</div>`}
      </div>
    </section>
  `;

  $$("[data-admin-vehicle]").forEach((button) =>
    button.addEventListener("click", () => openRecord("vehicles", button.dataset.adminVehicle, {}, "vehicle_admin", true))
  );
  $$("[data-admin-driver]").forEach((button) =>
    button.addEventListener("click", () => openRecord("drivers", button.dataset.adminDriver, {}, "driver_admin", true))
  );
}

function adminVehicleCard(vehicle) {
  const title = vehicleKey(vehicle) || "Vehiculo";
  const summaryStatus = vehicleCalendarStatus(vehicle);
  const rows = [
    adminDateRow("Verificacion 1er semestre", vehicle.first_verification_due, isVerificationDone(vehicle.first_verification_status) ? { key: "green", label: "Verificado" } : statusFromDate(vehicle.first_verification_due)),
    adminDateRow("Verificacion 2do semestre", vehicle.second_verification_due, isVerificationDone(vehicle.second_verification_status) ? { key: "green", label: "Verificado" } : statusFromDate(vehicle.second_verification_due)),
    adminDateRow("Tarjeta de circulacion", vehicle.registration_expires_at, statusFromDate(vehicle.registration_expires_at), vehicle.circulation_card_photo_url),
    adminFileRow("Placas", vehicle.plates_photo_url),
    adminDateRow("Refrendo / tenencia", vehicle.tax_expires_at, statusFromDate(vehicle.tax_expires_at)),
    adminDateRow("Seguro", vehicle.insurance_expires_at, statusFromDate(vehicle.insurance_expires_at), vehicle.insurance_policy_photo_url),
    adminDateRow("GPS", vehicle.gps_expires_at, statusFromDate(vehicle.gps_expires_at))
  ];
  return `
    <article class="admin-card">
      <div class="admin-card-head">
        <span class="admin-icon">${navIcon("car")}</span>
        <span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml([vehicle.brand, vehicle.model, vehicle.plates].filter(Boolean).join(" - ") || "Sin datos del vehiculo")}</small>
        </span>
        <em class="traffic ${summaryStatus.key}">${summaryStatus.label}</em>
      </div>
      <div class="admin-doc-list">
        ${rows.join("")}
      </div>
      <button class="small-btn admin-edit-btn" data-admin-vehicle="${vehicle.id}" type="button">${navIcon("edit")} Editar administracion</button>
    </article>
  `;
}

function adminDriverCard(driver) {
  const licenseStatus = statusFromDate(driver.license_expiration);
  const contractStatus = statusFromDate(driver.contract_end || driver.contract_renewal_date);
  const summaryStatus = [licenseStatus, contractStatus].some((item) => item.key === "red")
    ? { key: "red", label: "Vencido" }
    : [licenseStatus, contractStatus].some((item) => item.key === "yellow")
      ? { key: "yellow", label: "Proximo" }
      : { key: "green", label: "Vigente" };
  return `
    <article class="admin-card">
      <div class="admin-card-head">
        <span class="admin-icon">${navIcon("user")}</span>
        <span>
          <strong>${escapeHtml(driver.full_name || "Chofer")}</strong>
          <small>${escapeHtml(driver.vehicle_assigned || "Sin vehiculo asignado")}</small>
        </span>
        <em class="traffic ${summaryStatus.key}">${summaryStatus.label}</em>
      </div>
      <div class="admin-doc-list">
        ${adminDateRow("Licencia", driver.license_expiration, licenseStatus, driver.license_photo_url)}
        ${adminDateRow("Contrato / responsiva", driver.contract_end || driver.contract_renewal_date, contractStatus, driver.contract_file_url)}
      </div>
      <button class="small-btn admin-edit-btn" data-admin-driver="${driver.id}" type="button">${navIcon("edit")} Editar administracion</button>
    </article>
  `;
}

function adminDateRow(label, dateValue, status, fileUrl = "") {
  return `
    <div class="admin-doc-row">
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${dateValue || "Sin fecha"}${fileUrl ? ` - <a href="${escapeAttr(fileUrl)}" target="_blank" rel="noopener">Archivo</a>` : ""}</small>
      </span>
      <em class="traffic ${status.key}">${adminStatusLabel(status.label)}</em>
    </div>
  `;
}

function adminFileRow(label, fileUrl = "") {
  const status = fileUrl ? { key: "green", label: "Cargado" } : { key: "gray", label: "Sin archivo" };
  return `
    <div class="admin-doc-row">
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${fileUrl ? `<a href="${escapeAttr(fileUrl)}" target="_blank" rel="noopener">Ver archivo</a>` : "Sin archivo"}</small>
      </span>
      <em class="traffic ${status.key}">${status.label}</em>
    </div>
  `;
}

function adminStatusLabel(label) {
  return label === "Proximo" ? "Proximo a vencer" : label;
}

function renderServicesModule(title, subtitle) {
  const records = [...(state.services || [])].sort((a, b) => String(a.service_date || "").localeCompare(String(b.service_date || "")));
  const mileageRecords = [...(state.mileage_logs || [])].sort((a, b) => String(b.reading_date || "").localeCompare(String(a.reading_date || "")));
  const summary = serviceSummary(records);
  const view = $("#services-view");
  view.innerHTML = `
    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <button class="primary-btn" data-create="services" type="button">Agregar servicio</button>
      </div>
      <div class="stats-grid service-summary-grid">
        ${statCard("Reparaciones", money(summary.reparacion), "historial")}
        ${statCard("Refacciones", money(summary.refaccion), "historial")}
        ${statCard("Mantenimientos", money(summary.mantenimiento), "historial")}
        ${statCard("Revisiones", money(summary.revision), "historial")}
      </div>
      <div class="toolbar">
        <input data-search="services" placeholder="Buscar por coche, taller o nota" />
        <select data-filter="services">
          <option value="">Todos los estatus</option>
          <option value="priority">Pendientes y vencidos</option>
          <option value="yellow">Pendiente/programado</option>
          <option value="red">Vencidos</option>
          <option value="green">Realizado</option>
          <option value="gray">Sin fecha</option>
        </select>
        <button class="small-btn" data-clear="services" type="button">Limpiar</button>
      </div>
      <div class="service-history" data-grid="services">
        ${records.map(serviceHistoryRow).join("") || `<div class="empty-state">Aun no hay servicios mecanicos registrados.</div>`}
      </div>
    </section>

    <section class="module-panel mileage-panel">
      <div class="panel-header">
        <div>
          <h3>Kilometrajes</h3>
          <p>Bitacora independiente para registrar el kilometraje cada vez que una unidad entra al taller.</p>
        </div>
        <button class="primary-btn" data-create="mileage_logs" type="button">Agregar kilometraje</button>
      </div>
      <div class="service-history" data-grid="mileage_logs">
        ${mileageRecords.map(mileageLogRow).join("") || `<div class="empty-state">Aun no hay kilometrajes registrados.</div>`}
      </div>
    </section>
  `;
  bindModule("services");
  bindModule("mileage_logs");
}

function serviceSummary(records) {
  return records.reduce((totals, record) => {
    const key = record.service_type || "otro";
    totals[key] = (totals[key] || 0) + Number(record.cost || 0);
    totals.total += Number(record.cost || 0);
    return totals;
  }, { reparacion: 0, refaccion: 0, mantenimiento: 0, revision: 0, otro: 0, total: 0 });
}

function serviceHistoryRow(record) {
  const status = statusForRecord("services", record);
  return `
    <article class="service-row" data-edit-type="services" data-id="${record.id}">
      <button class="service-row-main" data-edit-type="services" data-id="${record.id}" type="button">
        <span>
          <strong>${record.service_date || "Sin fecha"} - ${record.vehicle_code || "Sin vehiculo"}</strong>
          <small>${capitalize(record.service_type || "servicio")} - ${record.provider || "Sin taller"} - ${money(record.cost || 0)}</small>
        </span>
        <span class="traffic ${status.key}">${status.label}</span>
      </button>
      <div class="service-row-meta">
        <span>Proxima revision: <b>${record.next_service_date || "Sin fecha"}</b></span>
      </div>
      ${record.notes ? `<p><b>Descripcion:</b> ${escapeHtml(record.notes)}</p>` : ""}
    </article>
  `;
}

function mileageLogRow(record) {
  const vehicle = record.vehicle_code || "Sin vehiculo";
  return `
    <article class="service-row mileage-row">
      <button class="service-row-main" data-edit-type="mileage_logs" data-id="${record.id}" type="button">
        <span>
          <strong>${record.reading_date || "Sin fecha"} - ${vehicle}</strong>
          <small>${record.reason || "Entrada a taller"}</small>
        </span>
        <span class="traffic green">${Number(record.kilometers || 0).toLocaleString("es-MX")} km</span>
      </button>
      ${record.notes ? `<p>${escapeHtml(record.notes)}</p>` : ""}
    </article>
  `;
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

const financeBucketLabels = {
  inversion: "Inversion",
  renta: "Rentas",
  otro_ingreso: "Otros ingresos",
  activo: "Activos",
  mantenimiento: "Mantenimiento",
  otro_egreso: "Otros egresos"
};

function textForFinance(record) {
  return [record.concept, record.category, record.notes, record.period].filter(Boolean).join(" ").toLowerCase();
}

function suggestedFinanceBucket(type, record) {
  const text = textForFinance(record);
  if (type === "income") {
    if (/\b(inversion|inversi[oÃ³]n|aportacion|aportaci[oÃ³]n|capital|socio|inicial)\b/.test(text)) return "inversion";
    if (/\b(renta|semanalidad|semana|pago|cobro|chofer)\b/.test(text)) return "renta";
    return "renta";
  }
  if (type === "expenses") {
    if (/\b(compra|vehiculo|vehiculo|auto|unidad|placa|placas|alta|inicial|gps inicial|seguro inicial|verificacion inicial|ponerlo a trabajar|poner a trabajar)\b/.test(text)) return "activo";
    if (/\b(mantenimiento|servicio|refaccion|refacci[oÃ³]n|llanta|llantas|aceite|freno|frenos|afinacion|afinaci[oÃ³]n|reparacion|reparaci[oÃ³]n|mano de obra|grua|gr[uÃº]a|taller)\b/.test(text)) return "mantenimiento";
    if (record.category === "mantenimiento" || record.category === "refaccion") return "mantenimiento";
    if (["GPS", "seguro"].includes(record.category) && /\b(inicial|alta|compra)\b/.test(text)) return "activo";
    return "otro_egreso";
  }
  return "";
}

function financeBucket(type, record) {
  return record.finance_bucket || suggestedFinanceBucket(type, record);
}

function financeBucketStatus(type, record) {
  return record.classification_status || (record.finance_bucket ? "manual" : "auto");
}

function financeBucketName(bucket) {
  return financeBucketLabels[bucket] || "En revision";
}

function financeRecords(type, bucket) {
  return state[type].filter((record) => financeBucket(type, record) === bucket);
}

function financeTotals() {
  const loans = loanSummary();
  const inversion = sum(financeRecords("income", "inversion"));
  const rentas = sum(financeRecords("income", "renta"));
  const otrosIngresos = sum(financeRecords("income", "otro_ingreso"));
  const activos = sum(financeRecords("expenses", "activo"));
  const mantenimiento = sum(financeRecords("expenses", "mantenimiento"));
  const otrosEgresos = sum(financeRecords("expenses", "otro_egreso"));
  const liquidez = inversion + rentas + otrosIngresos + loans.recovered - activos - mantenimiento - otrosEgresos - loans.lent;
  const utilidadOperativa = rentas + otrosIngresos - mantenimiento - otrosEgresos;
  return { inversion, rentas, otrosIngresos, activos, mantenimiento, otrosEgresos, loans, liquidez, utilidadOperativa };
}

function financeModuleCard(title, value, detail, tone) {
  return `
    <article class="finance-module-card ${tone || ""}">
      <p>${title}</p>
      <strong>${value}</strong>
      <small>${detail}</small>
    </article>
  `;
}

function financeMigrationRow(type, record) {
  const bucket = financeBucket(type, record);
  const status = financeBucketStatus(type, record);
  return `
    <button class="list-row migration-row" data-edit-type="${type}" data-id="${record.id}" type="button">
      <span>
        <strong>${record.concept || getTitle(type, record)}</strong>
        <small>${record.vehicle_code || "Sin vehiculo"} - ${record.date || record.loan_date || "Sin fecha"}</small>
      </span>
      <span>
        <b>${financeBucketName(bucket)}</b>
        <em class="traffic ${status === "manual" ? "green" : status === "revision" ? "yellow" : "gray"}">${status === "manual" ? "Manual" : status === "revision" ? "Revision" : "Sugerido"}</em>
      </span>
    </button>
  `;
}

function financeMigrationPreview() {
  const records = [
    ...state.income.map((record) => ({ type: "income", record })),
    ...state.expenses.map((record) => ({ type: "expenses", record }))
  ];
  if (!records.length) return `<div class="empty-state">Aun no hay ingresos o egresos por clasificar.</div>`;
  return records.map((item) => financeMigrationRow(item.type, item.record)).join("");
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
  const totals = financeTotals();
  const vehicleRows = getVehicleProfitability();
  $("#finance-view").innerHTML = `
    <section class="finance-hero-panel">
      <div>
        <p>Liquidez disponible</p>
        <strong>${money(totals.liquidez)}</strong>
        <small>Dinero realmente disponible, separado de activos y prestamos.</small>
      </div>
      <div class="finance-formula">
        Inversion + rentas + recuperado - activos - prestamos - mantenimiento - otros egresos
      </div>
    </section>

    <div class="finance-module-grid">
      ${financeModuleCard("Inversion", money(totals.inversion), "Capital inicial y aportaciones", "green")}
      ${financeModuleCard("Activos", money(totals.activos), "Vehiculos y gastos para iniciar", "gold")}
      ${financeModuleCard("Rentas", money(totals.rentas), "Ingresos por renta", "green")}
      ${financeModuleCard("Prestamos", money(totals.loans.outstanding), `${money(totals.loans.lent)} prestado`, "purple")}
      ${financeModuleCard("Mantenimiento", money(totals.mantenimiento), "Gastos por coche trabajando", "red")}
      ${financeModuleCard("Utilidad operativa", money(totals.utilidadOperativa), "No incluye compra de activos", "blue")}
    </div>

    <section class="module-panel finance-review-panel">
      <div class="panel-header">
        <div>
          <h3>Reclasificacion sugerida</h3>
          <p>Revisa los movimientos existentes. Si algo quedo mal, toca el registro y cambia el modulo financiero.</p>
        </div>
      </div>
      <div class="finance-list">
        ${financeMigrationPreview()}
      </div>
    </section>

    <section class="module-panel profitability-card">
      <div class="panel-header">
        <div>
          <h3>Balance por coche</h3>
          <p>Rentas, gastos y prestamos relacionados con cada unidad.</p>
        </div>
      </div>
      <div class="vehicle-finance-list">
        ${vehicleRows.length ? vehicleRows.map(vehicleFinanceRow).join("") : `<div class="empty-state">Captura vehiculos e ingresos/egresos para calcular rentabilidad.</div>`}
      </div>
    </section>

    <div class="dashboard-layout">
      ${financePanel("income", "Inversion", "Capital inicial y aportaciones posteriores.", "inversion")}
      ${financePanel("income", "Rentas", "Ingresos cobrados por renta de vehiculos.", "renta")}
      ${financePanel("expenses", "Activos", "Compra de vehiculos y gastos antes de operar.", "activo")}
      ${financePanel("expenses", "Mantenimiento", "Servicios, refacciones y reparaciones por vehiculo.", "mantenimiento")}
      ${financePanel("expenses", "Otros egresos", "Salidas de dinero que no son activos ni mantenimiento.", "otro_egreso")}
      <section class="module-panel loan-summary-panel">
        <div class="panel-header">
          <div>
            <h3>Prestamos</h3>
            <p>Dinero prestado, recuperado y saldo por cobrar.</p>
          </div>
          <button class="primary-btn" data-create="loans" type="button">Agregar prestamo</button>
        </div>
        <div class="finance-list" data-grid="loans">
          ${state.loans.map((record) => loanRow(record)).join("") || `<div class="empty-state">Sin prestamos registrados.</div>`}
        </div>
      </section>
    </div>
  `;
  bindModule("income");
  bindModule("expenses");
  bindModule("loans");
}

function financePanel(type, title, subtitle, bucket = "") {
  const records = bucket ? financeRecords(type, bucket) : state[type];
  const createBucket = bucket ? ` data-finance-bucket="${bucket}"` : "";
  return `
    <section class="module-panel">
      <div class="panel-header">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <button class="primary-btn" data-create="${type}"${createBucket} type="button">Agregar</button>
      </div>
      <div class="finance-list" data-grid="${type}">
        ${records.map((record) => financeRow(type, record)).join("") || `<div class="empty-state">Sin movimientos.</div>`}
      </div>
    </section>
  `;
}

function bindModule(type) {
  $$(`[data-create="${type}"]`).forEach((button) => button.addEventListener("click", () => openRecord(type, null, {
    finance_bucket: button.dataset.financeBucket || ""
  })));
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
    if (color === "priority") return textMatch && ["yellow", "red"].includes(status);
    return textMatch && (!color || status === color);
  });
  if (type === "services") {
    const sorted = records.sort((a, b) => String(a.service_date || "").localeCompare(String(b.service_date || "")));
    grid.innerHTML = sorted.map(serviceHistoryRow).join("") || `<div class="empty-state">No hay coincidencias.</div>`;
  } else if (type === "mileage_logs") {
    const sorted = records.sort((a, b) => String(b.reading_date || "").localeCompare(String(a.reading_date || "")));
    grid.innerHTML = sorted.map(mileageLogRow).join("") || `<div class="empty-state">No hay coincidencias.</div>`;
  } else {
    grid.innerHTML = records.map((record) => recordCard(type, record)).join("") || `<div class="empty-state">No hay coincidencias.</div>`;
  }
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
  const bucket = financeBucket(type, record);
  const status = financeBucketStatus(type, record);
  return `
    <button class="list-row" data-edit-type="${type}" data-id="${record.id}" type="button">
      <span>
        <strong>${record.concept || "Movimiento"}</strong>
        <small>${record.vehicle_code || "Sin vehiculo"} - ${record.date || "Sin fecha"} - ${financeBucketName(bucket)}</small>
      </span>
      <span>
        <b class="finance-amount ${type === "income" ? "positive" : "negative"}">${money(amount)}</b>
        <em class="traffic ${status === "manual" ? "green" : status === "revision" ? "yellow" : "gray"}">${status === "manual" ? "Manual" : status === "revision" ? "Revision" : "Sugerido"}</em>
      </span>
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
    const submitted = {};
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("__file_")) submitted[key] = value;
    }
    const existingRecord = activeRecordId ? state[activeRecordType].find((item) => item.id === activeRecordId) || {} : {};
    const record = { ...existingRecord, ...submitted };
    record.id = activeRecordId || crypto.randomUUID();
    applyRecordDefaults(activeRecordType, record);
    for (const field of fieldSets[activeFieldSetType || activeRecordType]) {
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

function openRecord(type, id = null, defaults = {}, fieldSetType = type, hideDelete = false) {
  activeRecordType = type;
  activeRecordId = id;
  activeFieldSetType = fieldSetType;
  const storedRecord = (id ? state[type].find((item) => item.id === id) : defaults) || {};
  const record = ["income", "expenses"].includes(type)
    ? {
        ...storedRecord,
        finance_bucket: storedRecord.finance_bucket || suggestedFinanceBucket(type, storedRecord),
        classification_status: storedRecord.classification_status || "revision"
      }
    : storedRecord;
  $("#dialog-title").textContent = `${id ? "Editar" : "Nuevo"} ${labelForType(fieldSetType) || labelForType(type)}`;
  $("#delete-record").classList.toggle("is-hidden", !id || hideDelete);
  $("#dialog-fields").innerHTML = fieldSets[fieldSetType].map((field) => inputForField(field, record)).join("");
  bindDialogFieldHelpers(type);
  $("#record-dialog").showModal();
}

function applyRecordDefaults(type, record) {
  if (type === "drivers" && !record.internal_code) {
    record.internal_code = `CH-${String(record.id || crypto.randomUUID()).slice(0, 6).toUpperCase()}`;
  }
  if (type === "vehicles" && !record.internal_code) {
    record.internal_code = `LB-${String(record.id || crypto.randomUUID()).slice(0, 6).toUpperCase()}`;
  }
  if (type === "vehicles" && record.verification_sticker) {
    const dates = verificationDatesFromSticker(record.verification_sticker);
    record.first_verification_due = record.first_verification_due || dates.first;
    record.second_verification_due = record.second_verification_due || dates.second;
  }
  if (type === "vehicles") {
    record.first_verification_status = record.first_verification_status || "pendiente";
    record.second_verification_status = record.second_verification_status || "pendiente";
    record.next_service_status = record.next_service_status || "pendiente";
  }
  if (type === "services") {
    record.status = record.status || "pendiente";
  }
  if (type === "mileage_logs") {
    record.reading_date = record.reading_date || isoDate(0);
  }
  if (type === "income" || type === "expenses") {
    record.finance_bucket = record.finance_bucket || suggestedFinanceBucket(type, record);
    record.classification_status = "manual";
  }
}

function bindDialogFieldHelpers(type) {
  if (type !== "vehicles") return;
  const sticker = $("#dialog-fields select[name='verification_sticker']");
  if (!sticker) return;
  const updateVerificationDates = () => {
    const dates = verificationDatesFromSticker(sticker.value);
    const first = $("#dialog-fields input[name='first_verification_due']");
    const second = $("#dialog-fields input[name='second_verification_due']");
    if (first) first.value = dates.first;
    if (second) second.value = dates.second;
  };
  sticker.addEventListener("change", updateVerificationDates);
  if (sticker.value) updateVerificationDates();
}

function verificationDatesFromSticker(sticker) {
  const year = today.getFullYear();
  const rule = verificationSchedule[sticker] || null;
  if (!rule) return { first: "", second: "" };
  return {
    first: lastDayOfMonth(year, rule.first[1]),
    second: lastDayOfMonth(year, rule.second[1])
  };
}

function lastDayOfMonth(year, monthNumber) {
  const date = new Date(year, monthNumber, 0);
  return date.toISOString().slice(0, 10);
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
        ${profileLine("AÃ±o", vehicle.year || "Sin aÃ±o")}
        ${profileLine("Color", vehicle.color || "Sin color")}
        ${profileLine("Engomado", vehicle.verification_sticker ? capitalize(vehicle.verification_sticker) : "Sin engomado")}
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
        <h4>Documentos del coche</h4>
        <div class="profile-docs">
          ${profileAttachment("Tarjeta de circulacion", vehicle.circulation_card_photo_url)}
          ${profileAttachment("Poliza de seguro", vehicle.insurance_policy_photo_url)}
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

    </div>
  `;
  $("#vehicle-profile-dialog").showModal();
}

function profileLine(label, value) {
  return `<p class="profile-line"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></p>`;
}

function profileAttachment(label, url) {
  return `
    <p class="profile-line">
      <span>${escapeHtml(label)}</span>
      <strong>${url ? `<a href="${escapeAttr(url)}" target="_blank" rel="noopener">Ver archivo</a>` : "Sin archivo"}</strong>
    </p>
  `;
}

function vehicleCalendarRows(vehicle) {
  const rows = [
    ["Seguro", vehicle.insurance_expires_at, statusFromDate(vehicle.insurance_expires_at)],
    ["Tarjeta", vehicle.registration_expires_at, statusFromDate(vehicle.registration_expires_at)],
    ["Verificacion 1er semestre", vehicle.first_verification_due, isVerificationDone(vehicle.first_verification_status) ? { key: "green", label: "Verificado" } : statusFromDate(vehicle.first_verification_due)],
    ["Verificacion 2do semestre", vehicle.second_verification_due, isVerificationDone(vehicle.second_verification_status) ? { key: "green", label: "Verificado" } : statusFromDate(vehicle.second_verification_due)],
    ["Tenencia", vehicle.tax_expires_at, statusFromDate(vehicle.tax_expires_at)],
    ["GPS", vehicle.gps_expires_at, statusFromDate(vehicle.gps_expires_at)]
  ].filter(([, , status]) => ["yellow", "red"].includes(status.key));
  if (!rows.length) return `<div class="empty-state">Sin pendientes administrativos.</div>`;
  const html = rows.map(([label, dateValue, status]) => {
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

function inputForField([name, label, type, options, targetField, accept], record = {}) {
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
  if (type === "driver-select") {
    const driverOptions = state.drivers.map((driver) => ({
      value: driver.full_name || driver.internal_code || "",
      label: [driver.internal_code, driver.full_name].filter(Boolean).join(" - ")
    })).filter((driver) => driver.value);
    return `
      <label>${label}
        <select name="${name}">
          <option value="">Seleccionar chofer</option>
          ${driverOptions.map((option) => `<option value="${escapeAttr(option.value)}" ${value === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (type === "sticker-select") {
    return `
      <label>${label}
        <select name="${name}">
          <option value="">Seleccionar engomado</option>
          ${Object.entries(verificationSchedule).map(([key, rule]) => `<option value="${key}" ${value === key ? "selected" : ""}>${capitalize(key)} - placas ${rule.plates}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (type === "file") {
    const acceptAttr = accept ? ` accept="${escapeAttr(accept)}"` : "";
    return `<label>${label}<input name="${name}" type="file"${acceptAttr} /></label>`;
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
  if (type === "number") {
    const decimalFields = ["amount", "cost", "recovered_amount"];
    const step = decimalFields.includes(name) ? "0.01" : "1";
    return `<label>${label}<input name="${name}" type="number" step="${step}" inputmode="decimal" value="${escapeAttr(value)}" /></label>`;
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
      if (key === "mileage_logs" && /does not exist|schema cache|relation/i.test(error.message || "")) {
        state[key] = state[key] || [];
        continue;
      }
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
    if (type === "mileage_logs" && /does not exist|schema cache|relation/i.test(error.message || "")) {
      alert("Falta crear la tabla de kilometrajes en Supabase. Corre el archivo mileage-logs.sql y vuelve a guardar.");
      return false;
    }
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
  if (type === "services") {
    if (isServiceClosed(record.status)) return { key: "green", label: String(record.status || "realizado") === "cancelado" ? "Cancelado" : "Realizado" };
    if (["pendiente", "programado"].includes(String(record.status || "").toLowerCase())) {
      return { key: "yellow", label: capitalize(record.status) };
    }
    return statusFromDate(record.next_service_date || record.service_date);
  }
  if (type === "gps") return statusFromDate(record.expires_at);
  if (type === "drivers") return statusFromDate(record.license_expiration);
  if (type === "loans") return loanStatus(record);
  if (type === "mileage_logs") return { key: "green", label: "Registrado" };
  return record.status === "activo" || record.status === "disponible" ? { key: "green", label: "Vigente" } : { key: "gray", label: "Sin fecha" };
}

function vehicleCalendarStatus(vehicle) {
  const statuses = vehicleAlertItems(vehicle).map((item) => item.status);
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

function isServiceClosed(status) {
  return ["realizado", "cancelado"].includes(String(status || "").toLowerCase());
}

function isVerificationDone(status) {
  return String(status || "").toLowerCase() === "verificado";
}

function vehicleAlertItems(vehicle) {
  const rows = [
    ["Seguro", vehicle.insurance_expires_at],
    ["Tarjeta de circulacion", vehicle.registration_expires_at],
    ["Tenencia", vehicle.tax_expires_at],
    ["GPS", vehicle.gps_expires_at]
  ];
  const items = rows
    .filter(([, dateValue]) => dateValue)
    .map(([label, dateValue]) => ({
      title: `${label} - ${vehicleKey(vehicle) || "Vehiculo"}`,
      detail: vehicle.model || vehicle.plates || "Calendario del vehiculo",
      status: statusFromDate(dateValue)
    }));

  if (vehicle.first_verification_due && !isVerificationDone(vehicle.first_verification_status)) {
    items.push({
      title: `Verificacion primer semestre - ${vehicleKey(vehicle) || "Vehiculo"}`,
      detail: vehicle.model || vehicle.plates || "Calendario del vehiculo",
      status: statusFromDate(vehicle.first_verification_due)
    });
  }
  if (vehicle.second_verification_due && !isVerificationDone(vehicle.second_verification_status)) {
    items.push({
      title: `Verificacion segundo semestre - ${vehicleKey(vehicle) || "Vehiculo"}`,
      detail: vehicle.model || vehicle.plates || "Calendario del vehiculo",
      status: statusFromDate(vehicle.second_verification_due)
    });
  }
  return items;
}

function collectAlerts() {
  const items = [];
  state.vehicles.forEach((vehicle) => {
    items.push(...vehicleAlertItems(vehicle));
  });
  state.services.forEach((record) => {
    if (isServiceClosed(record.status) || !record.next_service_date) return;
    items.push({
      title: `Servicio mecanico - ${record.vehicle_code || "Sin vehiculo"}`,
      detail: capitalize(record.service_type || "servicio"),
      status: statusFromDate(record.next_service_date)
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
  state.drivers.forEach((record) => {
    if (!record.contract_end) return;
    items.push({
      title: `Contrato - ${record.full_name || "Chofer"}`,
      detail: "Termino de contrato",
      status: statusFromDate(record.contract_end)
    });
  });
  state.drivers.forEach((record) => {
    if (!record.contract_renewal_date) return;
    items.push({
      title: `Renovacion de contrato - ${record.full_name || "Chofer"}`,
      detail: "Contrato",
      status: statusFromDate(record.contract_renewal_date)
    });
  });
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
    vehicles: [`Placas: ${record.plates || "N/D"}`, `Modelo: ${record.model || "N/D"}`, `Chofer: ${record.driver_name || "Sin asignar"}`, `Estatus: ${record.status || "N/D"}`],
    drivers: [`Codigo: ${record.internal_code || "N/D"}`, `Telefono: ${record.phone || "N/D"}`, `Vehiculo: ${record.vehicle_assigned || "Sin asignar"}`, `Estatus: ${record.status || "N/D"}`],
    documents: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Vence: ${record.expires_at || "Sin fecha"}`],
    services: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Proximo: ${record.next_service_date || "Sin fecha"}`, `Costo: ${money(record.cost || 0)}`],
    mileage_logs: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Fecha: ${record.reading_date || "Sin fecha"}`, `Km: ${Number(record.kilometers || 0).toLocaleString("es-MX")}`],
    gps: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Conexion: ${record.last_connection || "Sin dato"}`, `Vence: ${record.expires_at || "Sin fecha"}`]
  };
  return map[type] || [];
}

function getTitle(type, record) {
  if (type === "vehicles") return `${record.internal_code || "Unidad"} - ${record.brand || ""} ${record.model || ""}`.trim();
  if (type === "drivers") return `${record.internal_code || "Chofer"} - ${record.full_name || ""}`.trim();
  if (type === "documents") return record.document_name || "Documento";
  if (type === "services") return record.service_type || "Servicio";
  if (type === "mileage_logs") return `${record.vehicle_code || "Vehiculo"} - ${Number(record.kilometers || 0).toLocaleString("es-MX")} km`;
  if (type === "gps") return record.gps_name || "Unidad GPS";
  if (type === "loans") return record.borrower_name || "Prestamo";
  return record.concept || "Registro";
}

function labelForType(type) {
  return {
    vehicles: "vehiculo",
    vehicle_admin: "administracion del vehiculo",
    drivers: "chofer",
    driver_admin: "administracion del chofer",
    documents: "documento",
    services: "servicio",
    mileage_logs: "kilometraje",
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

function capitalize(text) {
  const value = String(text || "");
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

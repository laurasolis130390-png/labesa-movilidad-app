const CONFIG = window.LABESA_CONFIG || {};
const hasSupabase = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && window.supabase);
const supabaseClient = hasSupabase
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

const STORE_KEY = "labesa-movilidad-local";
const today = new Date();

const modules = [
  { id: "dashboard", title: "Dashboard general", icon: "▦" },
  { id: "vehicles", title: "Vehiculos", icon: "▣" },
  { id: "drivers", title: "Choferes", icon: "◉" },
  { id: "documents", title: "Documentos", icon: "◆" },
  { id: "services", title: "Servicios", icon: "◍" },
  { id: "gps", title: "GPS", icon: "⌖" },
  { id: "finance", title: "Finanzas", icon: "$" }
];

const tableMap = {
  vehicles: "vehicles",
  drivers: "drivers",
  documents: "vehicle_documents",
  services: "services",
  gps: "gps_units",
  income: "income",
  expenses: "expenses"
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
    ["notes", "Notas generales", "textarea"]
  ],
  drivers: [
    ["full_name", "Nombre completo", "text"],
    ["phone", "Telefono", "tel"],
    ["address", "Direccion", "textarea"],
    ["ine", "INE", "text"],
    ["license", "Licencia", "text"],
    ["license_expiration", "Vencimiento de licencia", "date"],
    ["vehicle_assigned", "Vehiculo asignado", "text"],
    ["photo_url", "Foto del chofer (URL publica)", "url"],
    ["__file_photo_url", "Subir foto del chofer", "file", "driver-photos", "photo_url"],
    ["status", "Estatus", "select", ["activo", "inactivo", "suspendido"]],
    ["notes", "Notas", "textarea"]
  ],
  documents: [
    ["vehicle_code", "Vehiculo", "text"],
    ["document_name", "Documento", "select", ["Tarjeta de circulacion", "Poliza de seguro", "Verificacion", "Tenencia", "Licencia del chofer", "Factura", "Otro"]],
    ["file_url", "Archivo / foto / PDF (URL publica)", "url"],
    ["__file_file_url", "Subir archivo", "file", "vehicle-documents", "file_url"],
    ["issued_at", "Fecha de emision", "date"],
    ["expires_at", "Fecha de vencimiento", "date"],
    ["notes", "Notas", "textarea"]
  ],
  services: [
    ["vehicle_code", "Vehiculo", "text"],
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
    ["vehicle_code", "Vehiculo", "text"],
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
    ["vehicle_code", "Vehiculo", "text"],
    ["driver_name", "Chofer", "text"],
    ["concept", "Concepto", "text"],
    ["date", "Fecha", "date"],
    ["amount", "Monto", "number"],
    ["payment_method", "Metodo de pago", "text"],
    ["period", "Semana o periodo", "text"],
    ["receipt_url", "Comprobante (URL publica)", "url"],
    ["__file_receipt_url", "Subir comprobante", "file", "finance-receipts", "receipt_url"],
    ["notes", "Notas", "textarea"]
  ],
  expenses: [
    ["vehicle_code", "Vehiculo", "text"],
    ["concept", "Concepto", "text"],
    ["date", "Fecha", "date"],
    ["amount", "Monto", "number"],
    ["category", "Categoria", "select", ["gasolina", "mantenimiento", "GPS", "seguro", "refaccion", "multa", "otro"]],
    ["receipt_url", "Comprobante (URL publica)", "url"],
    ["__file_receipt_url", "Subir comprobante", "file", "finance-receipts", "receipt_url"],
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
  ]
};

let state = loadLocal();
let activeView = "dashboard";
let activeRecordType = null;
let activeRecordId = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", init);

function init() {
  renderNavigation();
  bindAuth();
  bindDialog();
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
}

function showApp() {
  $("#login-screen").classList.add("is-hidden");
  $("#app-shell").classList.remove("is-hidden");
  renderAll();
}

function renderNavigation() {
  const markup = modules.map((item) => navButton(item)).join("");
  $("#main-menu").innerHTML = markup;
  $("#bottom-nav").innerHTML = markup;
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
  const pendingServices = state.services.filter((s) => statusFromDate(s.next_service_date).key !== "green").length;
  const income = sum(state.income);
  const expenses = sum(state.expenses);
  const balance = income - expenses;
  const maxMoney = Math.max(income, expenses, 1);

  $("#dashboard-view").innerHTML = `
    <div class="stats-grid">
      ${statCard("Unidades activas", activeVehicles, "Vehiculos operando")}
      ${statCard("Vehiculos", state.vehicles.length, "Registros totales")}
      ${statCard("Documentos por vencer", alertItems.length, "Amarillo y rojo")}
      ${statCard("Balance", money(balance), "Ingresos menos egresos")}
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
            <h3>Semaforo de alertas</h3>
            <p>Verde vigente, amarillo proximo, rojo vencido</p>
          </div>
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
          ${state.services.slice(0, 6).map((service) => alertRow({
            title: service.service_type || "Servicio",
            detail: service.vehicle_code || "Sin vehiculo",
            status: statusFromDate(service.next_service_date)
          })).join("") || `<div class="empty-state">Aun no hay servicios registrados.</div>`}
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

function renderFinance() {
  const income = sum(state.income);
  const expenses = sum(state.expenses);
  const balance = income - expenses;
  $("#finance-view").innerHTML = `
    <div class="stats-grid">
      ${statCard("Ingresos", money(income), "Total registrado")}
      ${statCard("Egresos", money(expenses), "Total registrado")}
      ${statCard("Utilidad / perdida", money(balance), "Balance = ingresos - egresos")}
      ${statCard("Movimientos", state.income.length + state.expenses.length, "Ingresos y egresos")}
    </div>
    <div class="dashboard-layout">
      ${financePanel("income", "Ingresos", "Crear ingresos por vehiculo, chofer y periodo.")}
      ${financePanel("expenses", "Egresos", "Registrar gastos por categoria y comprobante.")}
    </div>
  `;
  bindModule("income");
  bindModule("expenses");
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
        <small>${record.vehicle_code || "Sin vehiculo"} · ${record.date || "Sin fecha"}</small>
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
      if (field[2] === "number") record[field[0]] = Number(record[field[0]] || 0);
      if (field[2] === "file") {
        const file = formData.get(field[0]);
        if (file && file.name) {
          const publicUrl = await uploadRemoteFile(field[3], file);
          if (publicUrl) record[field[4]] = publicUrl;
        }
      }
    }
    const existingIndex = state[activeRecordType].findIndex((item) => item.id === record.id);
    if (existingIndex >= 0) {
      state[activeRecordType][existingIndex] = { ...state[activeRecordType][existingIndex], ...record };
    } else {
      state[activeRecordType].push(record);
    }
    await upsertRemote(activeRecordType, record);
    persist();
    $("#record-dialog").close();
    renderAll();
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

function inputForField([name, label, type, options], record = {}) {
  const value = record[name] || "";
  const full = type === "textarea" ? " full" : "";
  if (type === "textarea") {
    return `<label class="${full}">${label}<textarea name="${name}">${escapeHtml(value)}</textarea></label>`;
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

async function syncFromSupabase() {
  if (!hasSupabase) return;
  for (const [key, table] of Object.entries(tableMap)) {
    const { data, error } = await supabaseClient.from(table).select("*").order("created_at", { ascending: false });
    if (!error && Array.isArray(data)) state[key] = data;
  }
  persist();
}

async function upsertRemote(type, record) {
  if (!hasSupabase) return;
  const table = tableMap[type];
  if (!table) return;
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (sessionData.session?.user?.id && !record.user_id) {
    record.user_id = sessionData.session.user.id;
  }
  const { error } = await supabaseClient.from(table).upsert(record);
  if (error) alert(`No se pudo guardar en Supabase: ${error.message}`);
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
  if (type === "documents") return statusFromDate(record.expires_at);
  if (type === "services") return statusFromDate(record.next_service_date);
  if (type === "gps") return statusFromDate(record.expires_at);
  if (type === "drivers") return statusFromDate(record.license_expiration);
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
  state.documents.forEach((record) => items.push({
    title: record.document_name || "Documento",
    detail: record.vehicle_code || "Sin vehiculo",
    status: statusFromDate(record.expires_at)
  }));
  state.services.forEach((record) => items.push({
    title: record.service_type || "Servicio",
    detail: record.vehicle_code || "Sin vehiculo",
    status: statusFromDate(record.next_service_date)
  }));
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
    vehicles: [`Placas: ${record.plates || "N/D"}`, `Modelo: ${record.model || "N/D"}`, `Chofer: ${record.driver_name || "Sin asignar"}`],
    drivers: [`Telefono: ${record.phone || "N/D"}`, `Vehiculo: ${record.vehicle_assigned || "Sin asignar"}`, `Licencia: ${record.license_expiration || "Sin fecha"}`],
    documents: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Vence: ${record.expires_at || "Sin fecha"}`],
    services: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Proximo: ${record.next_service_date || "Sin fecha"}`, `Costo: ${money(record.cost || 0)}`],
    gps: [`Vehiculo: ${record.vehicle_code || "N/D"}`, `Conexion: ${record.last_connection || "Sin dato"}`, `Vence: ${record.expires_at || "Sin fecha"}`]
  };
  return map[type] || [];
}

function getTitle(type, record) {
  if (type === "vehicles") return `${record.internal_code || "Unidad"} · ${record.brand || ""} ${record.model || ""}`.trim();
  if (type === "drivers") return record.full_name || "Chofer";
  if (type === "documents") return record.document_name || "Documento";
  if (type === "services") return record.service_type || "Servicio";
  if (type === "gps") return record.gps_name || "Unidad GPS";
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
    expenses: "egreso"
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
  return String(text || "LB").split(/\s|·/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

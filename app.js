'use strict';

const DB_NAME = 'personal_inventory_mobile';
const DB_VERSION = 1;
const STORE_NAME = 'snapshot';
let inventory = null;
let database = null;

const $ = (id) => document.getElementById(id);

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readSnapshot() {
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get('current');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function saveSnapshot(snapshot) {
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(snapshot, 'current');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('No se pudo guardar la base local.'));
  });
}

function validateSnapshot(data) {
  if (!data || data.format !== 'personal_inventory_mobile') throw new Error('El archivo no corresponde al inventario personal.');
  if (data.schema_version !== 1) throw new Error('Versión de archivo no compatible.');
  if (data.read_only !== true) throw new Error('El archivo no está marcado como solo lectura.');
  for (const key of ['categories', 'item_types', 'locations', 'records']) {
    if (!Array.isArray(data[key])) throw new Error(`El archivo no contiene una lista válida de ${key}.`);
  }
  if (data.record_count !== data.records.length) throw new Error('La cantidad de registros declarada no coincide con el contenido.');
  for (const record of data.records) {
    if (!record || typeof record.code !== 'string' || typeof record.name !== 'string') {
      throw new Error('Se encontró un registro sin código o nombre válido.');
    }
    if (!['INDIVIDUAL', 'QUANTITY'].includes(record.tracking_mode)) throw new Error(`Tipo de seguimiento inválido en ${record.code}.`);
  }
  return data;
}

function escapeText(value) {
  return value === null || value === undefined || value === '' ? '—' : String(value);
}

function formatDate(value) {
  if (!value) return 'Fecha no disponible';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function setOptions(select, values, labelFor) {
  const current = select.value;
  select.replaceChildren(new Option('Todas', ''));
  values.forEach((value) => select.add(new Option(labelFor(value), value)));
  if ([...select.options].some((option) => option.value === current)) select.value = current;
}

function initializeView() {
  $('metric-records').textContent = inventory.records.length;
  $('metric-categories').textContent = inventory.categories.length;
  $('metric-locations').textContent = inventory.locations.length;
  $('import-status').textContent = `Última importación: ${formatDate(inventory.imported_at || inventory.exported_at)}`;
  $('last-updated').textContent = `IMPORTADO: ${formatDate(inventory.imported_at || inventory.exported_at).toUpperCase()}`;
  const categories = [...new Set(inventory.records.map((r) => r.category_name).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'es'));
  const locations = [...new Set(inventory.records.map((r) => r.location_path || r.location_name).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'es'));
  setOptions($('category-filter'), categories, (v) => v);
  setOptions($('location-filter'), locations, (v) => v);
  renderRecords();
}

function filteredRecords() {
  const query = $('search-input').value.trim().toLocaleLowerCase('es');
  const category = $('category-filter').value;
  const location = $('location-filter').value;
  const tracking = $('tracking-filter').value;
  return inventory.records.filter((record) => {
    if (category && record.category_name !== category) return false;
    if (location && (record.location_path || record.location_name) !== location) return false;
    if (tracking && record.tracking_mode !== tracking) return false;
    if (query) {
      const haystack = [record.code, record.name, record.item_type_name, record.category_name,
        record.location_name, record.location_path, record.description].join(' ').toLocaleLowerCase('es');
      if (!haystack.includes(query)) return false;
    }
    return true;
  }).sort((a,b) => a.name.localeCompare(b.name, 'es'));
}

function renderRecords() {
  const container = $('records-list');
  container.replaceChildren();
  if (!inventory) return;
  const records = filteredRecords();
  $('result-count').textContent = `${records.length} RESULTADOS`;
  if (!records.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No se encontraron registros con esos criterios.';
    container.append(empty);
    return;
  }
  records.forEach((record) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'record';
    button.addEventListener('click', () => showDetails(record));
    const code = document.createElement('span'); code.className = 'record-code'; code.textContent = record.code;
    const main = document.createElement('span'); main.className = 'record-main';
    const name = document.createElement('span'); name.className = 'record-name'; name.textContent = record.name;
    const sub = document.createElement('span'); sub.className = 'record-sub';
    sub.textContent = `${record.category_name || 'Sin categoría'} · ${record.location_path || record.location_name || 'Sin ubicación'}`;
    main.append(name, sub);
    const qty = document.createElement('span'); qty.className = 'record-qty';
    qty.textContent = record.tracking_mode === 'QUANTITY' ? `${escapeText(record.quantity)} ${escapeText(record.unit)}` : 'INDIVIDUAL';
    button.append(code, main, qty);
    container.append(button);
  });
}

function showDetails(record) {
  $('detail-name').textContent = record.name;
  $('detail-code').textContent = record.code;
  const fields = [
    ['Seguimiento', record.tracking_mode === 'INDIVIDUAL' ? 'Individual' : 'Por cantidad'],
    ['Tipo', record.item_type_name], ['Categoría', record.category_name],
    ['Ubicación', record.location_path || record.location_name],
    ['Cantidad', record.tracking_mode === 'INDIVIDUAL' ? '1 unidad' : `${escapeText(record.quantity)} ${escapeText(record.unit)}`],
    ['Condición física', record.physical_condition],
    ['Estado operativo', record.operational_status], ['Disponibilidad', record.availability_status],
  ];
  const grid = $('detail-grid'); grid.replaceChildren();
  fields.forEach(([label, value]) => {
    const cell = document.createElement('div'); cell.className = 'detail-cell';
    const caption = document.createElement('span'); caption.textContent = label.toUpperCase();
    const content = document.createElement('strong'); content.textContent = escapeText(value);
    cell.append(caption, content); grid.append(cell);
  });
  const description = $('detail-description');
  description.textContent = record.description ? `DESCRIPCIÓN\n${record.description}` : '';
  $('detail-dialog').showModal();
}

async function importFile(file) {
  $('import-error').hidden = true;
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const validated = validateSnapshot(parsed);
    const snapshot = { ...validated, imported_at: new Date().toISOString() };
    await saveSnapshot(snapshot);
    inventory = snapshot;
    initializeView();
    $('import-error').hidden = true;
  } catch (error) {
    $('import-error').textContent = `No se pudo importar: ${error.message || 'error desconocido'}`;
    $('import-error').hidden = false;
  } finally {
    $('json-file').value = '';
  }
}

async function start() {
  try {
    database = await openDatabase();
    inventory = await readSnapshot();
    if (inventory) initializeView();
  } catch (error) {
    $('import-error').textContent = `Error al iniciar el almacenamiento local: ${error.message}`;
    $('import-error').hidden = false;
  }
  $('json-file').addEventListener('change', (event) => importFile(event.target.files[0]));
  ['search-input', 'category-filter', 'location-filter', 'tracking-filter'].forEach((id) => {
    $(id).addEventListener(id === 'search-input' ? 'input' : 'change', renderRecords);
  });
  $('close-dialog').addEventListener('click', () => $('detail-dialog').close());
  $('detail-dialog').addEventListener('click', (event) => {
    if (event.target === $('detail-dialog')) $('detail-dialog').close();
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => console.warn('Service worker:', error));
  }
}

start();

/**
 * ==============================================================================
 * KEPLER ITEM HUB – APP LOGIC (Modern Vanilla JavaScript / ES Modules)
 * ==============================================================================
 * Diese Datei steuert die gesamte Dynamik:
 * 1. State Management (Zentrales Datenmodell)
 * 2. DOM-Rendering (Dynamische Cards)
 * 3. Event Handling (Filter, Suche, Modal)
 * 4. Lokale Persistenz (localStorage / IndexedDB)
 */

// ==============================================================================
// 1. STATE (Single Source of Truth im Speicher)
// ==============================================================================
let items = [];

const STORAGE_KEY = 'kepler_items_app_v1';

// Initialer Beispieldatensatz (falls der Speicher noch leer ist)
const INITIAL_ITEMS = [
  {
    id: 'item-1',
    title: 'Raspberry Pi 5 (8GB)',
    category: 'hardware',
    description: 'Mini-PC für Laborprojekte, Linux-Server und Hardware-Steuerung.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-2',
    title: 'Visual Studio Code',
    category: 'software',
    description: 'Code-Editor mit Cline AI Extension für Agentic Workflows.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-3',
    title: 'mBot2 Roboter-Parcours',
    category: 'projekte',
    description: 'Autonome Hindernisvermeidung und Linienfolge in Python.',
    rating: 4,
    createdAt: new Date().toISOString()
  }
];

// ==============================================================================
// 2. DOM ELEMENTE
// ==============================================================================
const cardGrid = document.getElementById('card-grid');
const itemCountEl = document.getElementById('item-count');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const clearAllBtn = document.getElementById('clear-all-btn');

// Dialog & Formular
const itemDialog = document.getElementById('item-dialog');
const openDialogBtn = document.getElementById('open-dialog-btn');
const closeDialogBtn = document.getElementById('close-dialog-btn');
const itemForm = document.getElementById('item-form');

// ==============================================================================
// 3. PERSISTENZ (Speichern & Laden in localStorage)
// ==============================================================================

/**
 * Lädt die gespeicherten Einträge aus dem Browser-Speicher.
 */
function loadItems() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      items = JSON.parse(rawData);
    } else {
      items = [...INITIAL_ITEMS];
      saveItems();
    }
  } catch (error) {
    console.error('Fehler beim Laden aus localStorage:', error);
    items = [...INITIAL_ITEMS];
  }
}

/**
 * Schreibt den aktuellen State in den Browser-Speicher.
 */
function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Fehler beim Speichern in localStorage:', error);
  }
}

// ==============================================================================
// 4. RENDERING & DOM-MANIPULATION
// ==============================================================================

/**
 * Rendert die Liste von Karten basierend auf aktuellen Filter- und Suchkriterien.
 */
function renderCards() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  // Filter-Logik
  const filtered = items.filter(item => {
    const matchesCategory = (selectedCategory === 'all' || item.category === selectedCategory);
    const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                          item.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  // Zähler aktualisieren
  itemCountEl.textContent = filtered.length;

  // Wenn leer: Empty State anzeigen
  if (filtered.length === 0) {
    cardGrid.innerHTML = `
      <p class="empty-state">
        Keine Einträge gefunden für Filter: <em>"${selectedCategory}"</em> und Suche: <em>"${searchTerm}"</em>.
      </p>
    `;
    return;
  }

  // HTML-Cards generieren
  cardGrid.innerHTML = filtered.map(item => `
    <article class="card" data-id="${item.id}">
      <div class="card-header">
        <h2 class="card-title">${escapeHtml(item.title)}</h2>
        <span class="card-badge">${escapeHtml(item.category)}</span>
      </div>
      <p class="card-body">${escapeHtml(item.description || 'Keine Beschreibung angegeben.')}</p>
      <div class="card-footer">
        <span class="card-rating" title="${item.rating} von 5 Sternen">
          ${'⭐'.repeat(item.rating || 5)}
        </span>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">Löschen</button>
      </div>
    </article>
  `).join('');
}

/**
 * XSS-Prävention: Maskiert gefährliche Zeichen vor dem Rendern
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==============================================================================
// 5. EVENT LISTENERS
// ==============================================================================

// Suche & Filterung in Echtzeit
searchInput.addEventListener('input', renderCards);
categoryFilter.addEventListener('change', renderCards);

// Modal Dialog öffnen & schließen
openDialogBtn.addEventListener('click', () => {
  itemForm.reset();
  itemDialog.showModal();
});

closeDialogBtn.addEventListener('click', () => {
  itemDialog.close();
});

// Neuer Eintrag einfügen
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('input-title').value.trim();
  const category = document.getElementById('input-category').value;
  const description = document.getElementById('input-description').value.trim();
  const rating = parseInt(document.getElementById('input-rating').value, 10) || 5;

  if (!title) return;

  const newItem = {
    id: 'item-' + Date.now(),
    title,
    category,
    description,
    rating,
    createdAt: new Date().toISOString()
  };

  items.unshift(newItem); // An den Anfang der Liste
  saveItems();
  renderCards();
  itemDialog.close();
});

// Event Delegation für dynamische Lösch-Buttons
cardGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      items = items.filter(item => item.id !== id);
      saveItems();
      renderCards();
    }
  }
});

// Alle Einträge löschen
clearAllBtn.addEventListener('click', () => {
  if (confirm('Möchtest du wirklich alle Einträge zurücksetzen?')) {
    items = [];
    saveItems();
    renderCards();
  }
});

// ==============================================================================
// 6. INITIALISIERUNG
// ==============================================================================
loadItems();
renderCards();

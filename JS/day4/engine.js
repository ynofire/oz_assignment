const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const FAVORITES_KEY = "crypto-favorites";
const REFRESH_MS = 1000;

const listEl = document.querySelector("#list");
const emptyEl = document.querySelector("#empty");
const emptyTitleEl = document.querySelector("#emptyTitle");
const emptyDescEl = document.querySelector("#emptyDesc");
const searchInput = document.querySelector("#searchInput");
const clearSearchBtn = document.querySelector("#clearSearch");
const favCountEl = document.querySelector("#favCount");
const statusTextEl = document.querySelector("#statusText");
const liveDotEl = document.querySelector("#liveDot");
const lastUpdateEl = document.querySelector("#lastUpdate");
const errorBanner = document.querySelector("#errorBanner");
const tabButtons = document.querySelectorAll(".tab");

let tickers = [];
let favorites = new Set(loadFavorites());
let activeTab = "all";
let query = "";
let hasLoaded = false;
let loadFailed = false;
let isLoading = false;
let lastSignature = "";
const rowCache = new Map();

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  } catch {
    return;
  }
}

async function loadTickers() {
  if (isLoading) return;
  isLoading = true;

  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    tickers = data
      .filter((item) => /^[A-Z0-9]+USDT$/.test(item.symbol))
      .map((item) => ({
        symbol: item.symbol,
        base: item.symbol.slice(0, -4),
        price: Number(item.lastPrice),
        change: Number(item.priceChangePercent),
        volume: Number(item.quoteVolume),
      }))
      .sort((a, b) => b.volume - a.volume);

    hasLoaded = true;
    loadFailed = false;
    setConnection(true);
    errorBanner.hidden = true;
    lastUpdateEl.textContent = new Date().toLocaleTimeString("ko-KR", { hour12: false });
    render();
  } catch {
    loadFailed = true;
    setConnection(false);
    errorBanner.hidden = false;
    errorBanner.textContent = "시세를 불러오지 못했습니다. 잠시 후 자동으로 다시 시도합니다.";
    if (!hasLoaded) render();
  } finally {
    isLoading = false;
  }
}

function setConnection(online) {
  liveDotEl.classList.toggle("online", online);
  liveDotEl.classList.toggle("off", !online);
  statusTextEl.textContent = online ? "실시간" : "연결 끊김";
}

function getVisibleTickers() {
  const keyword = query.trim().toUpperCase();

  return tickers.filter((ticker) => {
    if (activeTab === "favorites" && !favorites.has(ticker.symbol)) return false;
    if (keyword && !ticker.symbol.includes(keyword)) return false;
    return true;
  });
}

function updateFavoriteCount() {
  favCountEl.textContent = String(favorites.size);
}

function render() {
  updateFavoriteCount();

  const visible = getVisibleTickers();
  const signature =
    visible.map((ticker) => ticker.symbol).sort().join(",") +
    `|${activeTab}|${query.trim().toUpperCase()}`;

  if (visible.length === 0) {
    listEl.replaceChildren();
    rowCache.clear();
    lastSignature = signature;
    showEmptyState();
    return;
  }

  emptyEl.hidden = true;

  if (signature !== lastSignature) {
    rebuildList(visible);
    lastSignature = signature;
  } else {
    visible.forEach((ticker) => {
      const row = rowCache.get(ticker.symbol);
      if (row) updateRow(row, ticker);
    });
  }
}

function rebuildList(visible) {
  const fragment = document.createDocumentFragment();
  rowCache.clear();

  visible.forEach((ticker) => {
    const row = createRow(ticker);
    rowCache.set(ticker.symbol, row);
    fragment.appendChild(row);
  });

  listEl.replaceChildren(fragment);
}

function createRow(ticker) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.symbol = ticker.symbol;

  const star = document.createElement("button");
  star.type = "button";
  star.className = "star";
  star.setAttribute("aria-label", `${ticker.base} 관심항목 토글`);
  star.addEventListener("click", () => toggleFavorite(ticker.symbol));

  const name = document.createElement("div");
  name.className = "col-name";
  const base = document.createElement("span");
  base.className = "base";
  base.textContent = ticker.base;
  const quote = document.createElement("span");
  quote.className = "quote";
  quote.textContent = "/USDT";
  name.append(base, quote);

  const price = document.createElement("div");
  price.className = "col-price";
  const change = document.createElement("div");
  change.className = "col-change";
  const volume = document.createElement("div");
  volume.className = "col-volume";

  row.append(star, name, price, change, volume);

  row._star = star;
  row._price = price;
  row._change = change;
  row._volume = volume;

  updateRow(row, ticker);
  setStar(row, favorites.has(ticker.symbol));

  return row;
}

function updateRow(row, ticker) {
  row._price.textContent = formatPrice(ticker.price);

  const isUp = ticker.change > 0;
  const isDown = ticker.change < 0;
  const arrow = isUp ? "▲ " : isDown ? "▼ " : "";

  row._change.textContent = `${arrow}${ticker.change.toFixed(2)}%`;
  row._change.classList.toggle("up", isUp);
  row._change.classList.toggle("down", isDown);

  row._volume.textContent = formatVolume(ticker.volume);
}

function setStar(row, isFavorite) {
  row._star.textContent = isFavorite ? "★" : "☆";
  row._star.classList.toggle("active", isFavorite);
  row._star.setAttribute("aria-pressed", String(isFavorite));
}

function toggleFavorite(symbol) {
  if (favorites.has(symbol)) {
    favorites.delete(symbol);
  } else {
    favorites.add(symbol);
  }

  saveFavorites();
  updateFavoriteCount();

  if (activeTab === "favorites") {
    render();
    return;
  }

  const row = rowCache.get(symbol);
  if (row) setStar(row, favorites.has(symbol));
}

function showEmptyState() {
  emptyEl.hidden = false;

  if (!hasLoaded && loadFailed) {
    emptyTitleEl.textContent = "시세를 불러올 수 없습니다";
    emptyDescEl.textContent = "네트워크 상태를 확인해 주세요. 자동으로 다시 시도합니다.";
  } else if (!hasLoaded) {
    emptyTitleEl.textContent = "시세를 불러오는 중…";
    emptyDescEl.textContent = "잠시만 기다려 주세요.";
  } else if (query.trim()) {
    emptyTitleEl.textContent = `“${query.trim()}” 검색 결과가 없습니다`;
    emptyDescEl.textContent = "다른 코인 이름으로 검색해 보세요.";
  } else if (activeTab === "favorites") {
    emptyTitleEl.textContent = "관심항목이 없습니다";
    emptyDescEl.textContent = "별표(☆)를 눌러 관심 코인을 추가해 보세요.";
  } else {
    emptyTitleEl.textContent = "표시할 코인이 없습니다";
    emptyDescEl.textContent = "잠시 후 다시 시도해 주세요.";
  }
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return "-";

  const digits = value >= 1 ? 2 : value >= 0.01 ? 4 : value >= 0.0001 ? 6 : 8;
  return (
    "$" +
    value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  );
}

function formatVolume(value) {
  if (!Number.isFinite(value)) return "-";
  if (value >= 1e12) return "$" + (value / 1e12).toFixed(2) + "T";
  if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return "$" + (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return "$" + (value / 1e3).toFixed(2) + "K";
  return "$" + value.toFixed(2);
}

tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.tab === activeTab) return;

    activeTab = tab.dataset.tab;
    tabButtons.forEach((button) => {
      const isActive = button === tab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    render();
  });
});

searchInput.addEventListener("input", (event) => {
  query = event.target.value;
  clearSearchBtn.hidden = query.length === 0;
  render();
});

clearSearchBtn.addEventListener("click", () => {
  query = "";
  searchInput.value = "";
  clearSearchBtn.hidden = true;
  searchInput.focus();
  render();
});

updateFavoriteCount();
loadTickers();
setInterval(loadTickers, REFRESH_MS);

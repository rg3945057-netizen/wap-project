const inp = document.getElementById("animeInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const modeBtn = document.getElementById("modeBtn");

const loading = document.getElementById("loading");
const msg = document.getElementById("msg");

const mainCard = document.getElementById("mainCard");
const quoteSec = document.getElementById("quoteSec");
const quoteCard = document.getElementById("quoteCard");

const relSec = document.getElementById("relSec");
const relBox = document.getElementById("relBox");

const genreSel = document.getElementById("genreSel");
const scoreSel = document.getElementById("scoreSel");
const sortSel = document.getElementById("sortSel");

const sugBox = document.getElementById("sugBox");
const favBox = document.getElementById("favBox");

let mainAnime = null;
let relList = [];
let timer = null;
let openMore = false;

function showLoad() {
  loading.classList.remove("hide");
}

function hideLoad() {
  loading.classList.add("hide");
}

function showMsg(text, type = "err") {
  msg.textContent = text;
  msg.className = `msg ${type}`;
  msg.classList.remove("hide");
}

function hideMsg() {
  msg.textContent = "";
  msg.className = "msg hide";
}

function clearData() {
  mainCard.innerHTML = "";
  mainCard.classList.add("hide");

  quoteCard.innerHTML = "";
  quoteSec.classList.add("hide");

  relBox.innerHTML = "";
  relSec.classList.add("hide");

  sugBox.innerHTML = "";
  sugBox.classList.add("hide");

  mainAnime = null;
  relList = [];
  openMore = false;

  hideMsg();
}

function setMode(mode) {
  if (mode === "dark") {
    document.body.classList.add("dark");
    modeBtn.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    modeBtn.textContent = "Dark Mode";
  }
  localStorage.setItem("animeMode", mode);
}

function loadMode() {
  const saved = localStorage.getItem("animeMode") || "light";
  setMode(saved);
}

function toggleMode() {
  setMode(document.body.classList.contains("dark") ? "light" : "dark");
}

function getFav() {
  return JSON.parse(localStorage.getItem("animeFav")) || [];
}

function saveFav(arr) {
  localStorage.setItem("animeFav", JSON.stringify(arr));
}

function isFav(id) {
  return getFav().some((x) => x.mal_id === id);
}

function addFav(anime) {
  const arr = getFav();
  if (arr.some((x) => x.mal_id === anime.mal_id)) {
    showMsg("This anime is already in favorites.", "ok");
    return;
  }

  arr.push({
    mal_id: anime.mal_id,
    title: anime.title,
    image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "",
    score: anime.score ?? "N/A",
    year: anime.year ?? "N/A"
  });

  saveFav(arr);
  drawFav();
  drawMain();
  showMsg("Anime added to favorites.", "ok");
}

function delFav(id) {
  const arr = getFav().filter((x) => x.mal_id !== id);
  saveFav(arr);
  drawFav();
  if (mainAnime) drawMain();
  showMsg("Anime removed from favorites.", "ok");
}

function drawFav() {
  const arr = getFav();

  if (!arr.length) {
    favBox.innerHTML = `<div class="empty">No favorites saved yet.</div>`;
    return;
  }

  favBox.innerHTML = arr.map((x) => `
    <div class="card">
      <img src="${x.image}" alt="${x.title}">
      <h3>${x.title}</h3>
      <p>Score: ${x.score}</p>
      <p>Year: ${x.year}</p>
      <div class="card-actions">
        <button class="small-btn" onclick="openAnime('${safe(x.title)}')">Open</button>
        <button class="small-btn" onclick="delFav(${x.mal_id})">Remove</button>
      </div>
    </div>
  `).join("");
}

function safe(text) {
  return String(text).replace(/'/g, "\\'");
}

function fillGenre(anime) {
  genreSel.innerHTML = `<option value="all">All Genres</option>`;
  const list = anime.genres?.map((g) => g.name) || [];
  list.forEach((g) => {
    const op = document.createElement("option");
    op.value = g.toLowerCase();
    op.textContent = g;
    genreSel.appendChild(op);
  });
}

function drawMain() {
  if (!mainAnime) return;

  const a = mainAnime;
  const genres = a.genres?.map((g) => g.name).join(", ") || "N/A";
  const studios = a.studios?.map((s) => s.name).join(", ") || "N/A";
  const themes = a.themes?.map((t) => t.name).join(", ") || "N/A";

  mainCard.innerHTML = `
    <img src="${a.images.jpg.large_image_url}" alt="${a.title}" />
    <div class="info">
      <h2>${a.title}</h2>

      <div class="meta">
        <span>Score: ${a.score ?? "N/A"}</span>
        <span>Episodes: ${a.episodes ?? "N/A"}</span>
        <span>Status: ${a.status ?? "N/A"}</span>
        <span>Year: ${a.year ?? "N/A"}</span>
      </div>

      <p class="line"><strong>Genres:</strong> ${genres}</p>
      <p class="line"><strong>Studios:</strong> ${studios}</p>

      ${openMore ? `
        <p class="line"><strong>Themes:</strong> ${themes}</p>
        <p class="line"><strong>Source:</strong> ${a.source || "N/A"}</p>
        <p class="line"><strong>Rating:</strong> ${a.rating || "N/A"}</p>
        <p class="line"><strong>Duration:</strong> ${a.duration || "N/A"}</p>
      ` : ""}

      <p class="syn">${a.synopsis || "No synopsis available."}</p>

      <div class="actions">
        <button class="act-btn" onclick="favNow()">
          ${isFav(a.mal_id) ? "Saved in Favorites" : "Add to Favorites"}
        </button>
        <button class="act-btn" onclick="toggleMore()">
          ${openMore ? "View Less" : "View More"}
        </button>
      </div>
    </div>
  `;

  mainCard.classList.remove("hide");
}

function drawQuote(data) {
  quoteCard.innerHTML = data;
  quoteSec.classList.remove("hide");
}

function drawRelated() {
  let arr = [...relList];
  const g = genreSel.value;
  const s = scoreSel.value;
  const sort = sortSel.value;

  if (g !== "all") {
    arr = arr.filter((x) =>
      x.title.toLowerCase().includes(g) ||
      x.synopsis.toLowerCase().includes(g) ||
      x.kind.toLowerCase().includes(g)
    );
  }

  if (s !== "all") {
    arr = arr.filter((x) => x.rating !== null && x.rating / 10 >= Number(s));
  }

  if (sort === "az") arr.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "za") arr.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "high") arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === "low") arr.sort((a, b) => (a.rating || 0) - (b.rating || 0));

  if (!arr.length) {
    relBox.innerHTML = `<div class="empty">No related anime matched the selected filters.</div>`;
    relSec.classList.remove("hide");
    return;
  }

  relBox.innerHTML = "";
  arr.forEach((x) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${x.image}" alt="${x.title}">
      <h3>${x.title}</h3>
      <p>${x.rating ? `Rating: ${(x.rating / 10).toFixed(1)}` : "Rating: N/A"}</p>
      <p>${x.synopsis.slice(0, 110)}...</p>
      <div class="card-actions">
        <button class="small-btn">Open</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => openAnime(x.title));
    relBox.appendChild(card);
  });

  relSec.classList.remove("hide");
}

async function getQuote(title) {
  try {
    const res = await fetch(`https://api.animechan.io/v1/quotes/random?anime=${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!data.data) throw new Error();

    drawQuote(`
      <p>"${data.data.content}"</p>
      <h3>${data.data.character.name} — ${data.data.anime.name}</h3>
    `);
  } catch {
    drawQuote(`<p>No quote is available for this anime at the moment.</p>`);
  }
}

async function getRelated(q) {
  try {
    const res = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(q)}&page[limit]=12`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.data?.length) return;

    relList = data.data.map((item) => {
      const a = item.attributes;
      return {
        title: a.canonicalTitle || "Untitled",
        rating: a.averageRating ? Number(a.averageRating) : null,
        image: a.posterImage?.medium || "",
        synopsis: a.synopsis || "No description available.",
        kind: a.subtype || "Unknown"
      };
    });

    drawRelated();
  } catch (e) {
    console.log(e);
  }
}

async function searchAnime(name = null) {
  const q = (name || inp.value).trim();
  if (!q) {
    showMsg("Please enter an anime title.", "err");
    return;
  }

  inp.value = q;
  clearData();
  showLoad();

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.data?.length) {
      hideLoad();
      showMsg("No anime title was found.", "err");
      return;
    }

    mainAnime = data.data[0];
    fillGenre(mainAnime);
    drawMain();

    await getQuote(mainAnime.title);
    await getRelated(q);

    hideLoad();
    showMsg("Anime data loaded successfully.", "ok");
  } catch (e) {
    hideLoad();
    showMsg("Failed to fetch anime data.", "err");
    console.log(e);
  }
}

async function getSug(q) {
  if (!q || q.length < 2) {
    sugBox.innerHTML = "";
    sugBox.classList.add("hide");
    return;
  }

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=5`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.data?.length) {
      sugBox.innerHTML = "";
      sugBox.classList.add("hide");
      return;
    }

    sugBox.innerHTML = data.data.map((x) => `
      <div class="sug-item" data-name="${x.title}">${x.title}</div>
    `).join("");

    sugBox.classList.remove("hide");

    document.querySelectorAll(".sug-item").forEach((item) => {
      item.addEventListener("click", () => {
        const name = item.getAttribute("data-name");
        inp.value = name;
        sugBox.classList.add("hide");
        searchAnime(name);
      });
    });
  } catch (e) {
    console.log(e);
  }
}

function resetAll() {
  inp.value = "";
  genreSel.value = "all";
  scoreSel.value = "all";
  sortSel.value = "default";
  clearData();
  hideLoad();
}

function openAnime(name) {
  inp.value = name;
  searchAnime(name);
}

function favNow() {
  if (mainAnime) addFav(mainAnime);
}

function toggleMore() {
  openMore = !openMore;
  drawMain();
}

searchBtn.addEventListener("click", () => searchAnime());
resetBtn.addEventListener("click", resetAll);
modeBtn.addEventListener("click", toggleMode);

inp.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchAnime();
});

inp.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => getSug(inp.value.trim()), 350);
});

document.addEventListener("click", (e) => {
  if (!sugBox.contains(e.target) && e.target !== inp) {
    sugBox.classList.add("hide");
  }
});

genreSel.addEventListener("change", drawRelated);
scoreSel.addEventListener("change", drawRelated);
sortSel.addEventListener("change", drawRelated);

loadMode();
drawFav();

window.openAnime = openAnime;
window.delFav = delFav;
window.favNow = favNow;
window.toggleMore = toggleMore;
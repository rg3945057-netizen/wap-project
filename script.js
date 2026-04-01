const animeInput = document.getElementById("animeInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

const loading = document.getElementById("loading");
const messageBox = document.getElementById("messageBox");

const mainCard = document.getElementById("mainCard");
const quoteSection = document.getElementById("quoteSection");
const quoteCard = document.getElementById("quoteCard");

const relatedSection = document.getElementById("relatedSection");
const relatedContainer = document.getElementById("relatedContainer");

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove("hidden");
}

function hideMessage() {
  messageBox.textContent = "";
  messageBox.className = "message hidden";
}

function clearUI() {
  mainCard.innerHTML = "";
  mainCard.classList.add("hidden");

  quoteCard.innerHTML = "";
  quoteSection.classList.add("hidden");

  relatedContainer.innerHTML = "";
  relatedSection.classList.add("hidden");

  hideMessage();
}

async function searchAnime() {
  const query = animeInput.value.trim();

  if (!query) {
    showMessage("Please enter an anime name.");
    return;
  }

  clearUI();
  showLoading();

  try {
    const jikanRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
    if (!jikanRes.ok) {
      throw new Error("Jikan API request failed");
    }

    const jikanData = await jikanRes.json();

    if (!jikanData.data || jikanData.data.length === 0) {
      hideLoading();
      showMessage("No anime found.");
      return;
    }

    const anime = jikanData.data[0];
    renderMainAnime(anime);

    await loadAnimeQuote(anime.title);
    await loadRelatedAnime(query);

    hideLoading();
    showMessage("Anime data loaded successfully.", "success");
  } catch (error) {
    hideLoading();
    showMessage("Failed to fetch anime data.");
    console.error(error);
  }
}

function renderMainAnime(anime) {
  mainCard.innerHTML = `
    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" />
    <div class="main-info">
      <h2>${anime.title}</h2>
      <div class="meta">
        <span>Score: ${anime.score ?? "N/A"}</span>
        <span>Episodes: ${anime.episodes ?? "N/A"}</span>
        <span>Status: ${anime.status ?? "N/A"}</span>
        <span>Year: ${anime.year ?? "N/A"}</span>
      </div>
      <p><strong>Genres:</strong> ${anime.genres.map((g) => g.name).join(", ") || "N/A"}</p>
      <p class="synopsis">${anime.synopsis || "No synopsis available."}</p>
    </div>
  `;
  mainCard.classList.remove("hidden");
}

async function loadAnimeQuote(title) {
  try {
    const res = await fetch(
      `https://api.animechan.io/v1/quotes/random?anime=${encodeURIComponent(title)}`
    );

    if (!res.ok) {
      throw new Error("Animechan API request failed");
    }

    const result = await res.json();

    if (!result.data) {
      throw new Error("No quote found");
    }

    quoteCard.innerHTML = `
      <p>"${result.data.content}"</p>
      <h3>${result.data.character.name} — ${result.data.anime.name}</h3>
    `;
    quoteSection.classList.remove("hidden");
  } catch (error) {
    quoteCard.innerHTML = `
      <p>No quote available for this anime right now.</p>
    `;
    quoteSection.classList.remove("hidden");
    console.error(error);
  }
}

async function loadRelatedAnime(query) {
  try {
    const res = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=6`);

    if (!res.ok) {
      throw new Error("Kitsu API request failed");
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return;
    }

    data.data.forEach((item) => {
      const attrs = item.attributes;

      const card = document.createElement("div");
      card.className = "related-card";

      card.innerHTML = `
        <img src="${attrs.posterImage?.medium || ""}" alt="${attrs.canonicalTitle}" />
        <h3>${attrs.canonicalTitle}</h3>
        <p>${attrs.averageRating ? `Rating: ${attrs.averageRating}` : "Rating: N/A"}</p>
      `;

      relatedContainer.appendChild(card);
    });

    relatedSection.classList.remove("hidden");
  } catch (error) {
    console.error(error);
  }
}

function resetApp() {
  animeInput.value = "";
  clearUI();
  hideLoading();
}

searchBtn.addEventListener("click", searchAnime);
resetBtn.addEventListener("click", resetApp);

animeInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchAnime();
  }
});
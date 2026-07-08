
const WIDGET_TITLES = {
  "fun-fact": "Fun Fact of the Day",
  "joke": "Joke of the Day",
  "word": "Word of the Day",
  "on-this-day": "On This Day"
};

const DATA_FILES = {
  "fun-fact": "../data/facts.json",
  "joke": "../data/jokes.json",
  "word": "../data/words.json",
  "on-this-day": "../data/history.json"
};

function getWidgetType() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("/joke")) return "joke";
  if (path.includes("/word")) return "word";
  if (path.includes("/on-this-day")) return "on-this-day";
  return "fun-fact";
}

function dayNumberSinceStart() {
  const start = new Date("2025-01-01T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / 86400000);
}

function formatDate() {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function todayMonthDayKey() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function pickDailyItem(items) {
  const index = Math.abs(dayNumberSinceStart()) % items.length;
  return { item: items[index], number: index + 1 };
}

function resizeForGoogleSites() {
  const widget = document.querySelector(".widget");
  if (!widget) return;
  const height = widget.offsetHeight;
  document.documentElement.style.height = height + "px";
  document.body.style.height = height + "px";
}

function renderFunFact(data) {
  const picked = pickDailyItem(data);
  return `
    <div class="label">Fact #${picked.number}</div>
    <p class="main-text">${picked.item.fact}</p>
  `;
}

function renderJoke(data) {
  const picked = pickDailyItem(data);
  return `
    <div class="label">Joke #${picked.number}</div>
    <p class="main-text">${picked.item.question}</p>
    <p class="secondary-text">${picked.item.answer}</p>
  `;
}

function renderWord(data) {
  const picked = pickDailyItem(data);
  return `
    <div class="label">Word #${picked.number}</div>
    <p class="word">${picked.item.word}</p>
    <div class="part-of-speech">${picked.item.partOfSpeech}</div>
    <div class="definition">${picked.item.definition}</div>
    <div class="example"><strong>Example:</strong> ${picked.item.example}</div>
  `;
}

function renderOnThisDay(data) {
  const key = todayMonthDayKey();
  const item = data[key] || pickDailyItem(Object.values(data)).item;
  return `
    <div class="label">${item.date}</div>
    <p class="main-text">${item.text}</p>
  `;
}

async function startWidget() {
  const type = getWidgetType();

  document.getElementById("title").textContent = WIDGET_TITLES[type];
  document.getElementById("date").textContent = formatDate();

  try {
    const response = await fetch(DATA_FILES[type]);
    const data = await response.json();

    let html = "";
    if (type === "fun-fact") html = renderFunFact(data);
    if (type === "joke") html = renderJoke(data);
    if (type === "word") html = renderWord(data);
    if (type === "on-this-day") html = renderOnThisDay(data);

    document.getElementById("content").innerHTML = html;
  } catch (error) {
    document.getElementById("content").innerHTML =
      `<p class="main-text">This widget could not load today. Please check the data files.</p>`;
  }

  resizeForGoogleSites();
  setTimeout(resizeForGoogleSites, 300);
  window.addEventListener("resize", resizeForGoogleSites);
}

startWidget();

const STOPS = [
  { name: "Manaus", km: 0, note: "At Manaus, the dark Rio Negro meets the sediment-rich Solimões without immediately mixing." },
  { name: "Careiro", km: 185, note: "Várzea forests flood seasonally, feeding fish with fruit and seeds from the canopy." },
  { name: "Parintins", km: 420, note: "River communities read currents, clouds, and bird calls as a practical navigation system." },
  { name: "Óbidos", km: 720, note: "Near Óbidos, the Amazon narrows and deepens; the current grows remarkably strong." },
  { name: "Alter do Chão", km: 1060, note: "Clear-water tributaries can form pale sand beaches when the river level falls." },
  { name: "Santarém", km: 1340, note: "Santarém stands near another striking meeting of dark and sediment-rich waters." }
];

const ANIMALS = [
  { id: "dolphin", icon: "◒", name: "Pink river dolphin" },
  { id: "macaw", icon: "◆", name: "Scarlet macaw" },
  { id: "sloth", icon: "♧", name: "Three-toed sloth" },
  { id: "caiman", icon: "⌁", name: "Spectacled caiman" },
  { id: "capybara", icon: "●", name: "Capybara" },
  { id: "tamarin", icon: "✦", name: "Tamarin" },
  { id: "toucan", icon: "◐", name: "Toucan" },
  { id: "jaguar", icon: "◇", name: "Jaguar" }
];

const FIELD_NOTES = [
  "A forest that looks still is constantly signaling—through scent, vibration, and sound.",
  "Pink river dolphins use echolocation to hunt through flooded forests and murky channels.",
  "Many Amazon fish eat fruit, dispersing seeds across the floodplain.",
  "A sudden line of cool wind often arrives just before a tropical downpour.",
  "Macaws gather at clay licks, possibly to balance minerals in their fruit-heavy diet.",
  "The river rises and falls by many meters, remaking the shoreline each season."
];

const WEATHER = [
  { icon: "☀", label: "Clear", temp: 31, risk: 0 },
  { icon: "☁", label: "Heavy air", temp: 29, risk: 1 },
  { icon: "☂", label: "Rain", temp: 27, risk: 2 },
  { icon: "ϟ", label: "Storm", temp: 25, risk: 4 }
];

const EVENTS = [
  {
    title: "A submerged branch",
    copy: "The current spins the canoe toward a pale branch just below the surface. You have seconds to react.",
    choices: [
      { label: "Cut hard across the current", hint: "Risk the hull", effect: s => chance(.68) ? change(s, { progress: 28, morale: 2 }, "Clean turn. The obstacle slips past.") : change(s, { boat: -13, morale: -4 }, "The branch scrapes hard along the hull.") },
      { label: "Ease off and pole around", hint: "Lose time", effect: s => change(s, { food: -2, fuel: -1 }, "Slow, careful work gets everyone through safely.") }
    ]
  },
  {
    title: "Smoke above the bank",
    copy: "A small riverside settlement appears through the trees. A family waves from a wooden landing.",
    choices: [
      { label: "Stop and trade", hint: "Spend 2 trade goods", disabled: s => s.trade < 2, effect: s => change(s, { trade: -2, food: 14, medicine: 1, morale: 4 }, "You exchange tools and stories for cassava, fruit, and medicine.") },
      { label: "Wave and continue", hint: "Keep your pace", effect: s => change(s, { morale: 1, progress: 12 }, "The children race the canoe along the bank.") }
    ]
  },
  {
    title: "A flash of rose",
    copy: "Something smooth breaks the brown water beside the canoe—then surfaces again, unmistakably pink.",
    choices: [
      { label: "Drift quietly and observe", hint: "Journal discovery", effect: s => discover(s, "dolphin", "A pink river dolphin circles twice before vanishing.") },
      { label: "Press onward", hint: "+ distance", effect: s => change(s, { progress: 18 }, "You keep to the channel and make good time.") }
    ]
  },
  {
    title: "The forest goes dark",
    copy: "A wall of rain crosses the river. The wind lifts white caps and visibility falls to a few canoe lengths.",
    choices: [
      { label: "Find a sheltered inlet", hint: "Use provisions", effect: s => change(s, { food: -3, morale: 2 }, "You wait beneath broad leaves until the worst has passed.") },
      { label: "Run before the storm", hint: "High risk", effect: s => chance(.48) ? change(s, { progress: 35, morale: 4 }, "The squall pushes you forward at thrilling speed.") : change(s, { boat: -16, health: -7 }, "Waves break over the bow and supplies tumble loose.") }
    ]
  },
  {
    title: "Tracks in the mud",
    copy: "Fresh prints cross a bright sandbar: round pads, no claw marks, larger than your palm.",
    choices: [
      { label: "Follow from a distance", hint: "Possible discovery", effect: s => chance(.6) ? discover(s, "jaguar", "For one breathless moment, a jaguar watches from the reeds.") : change(s, { food: -2, morale: -1 }, "The trail disappears into tangled roots.") },
      { label: "Photograph the tracks", hint: "Safe fieldwork", effect: s => change(s, { morale: 3 }, "A careful scale drawing makes a valuable record.") }
    ]
  },
  {
    title: "A fever in camp",
    copy: "One of the crew wakes shivering despite the heat. Rest and treatment could prevent a dangerous decline.",
    choices: [
      { label: "Use medicine and rest", hint: "Use 1 medicine", disabled: s => s.medicine < 1, effect: s => change(s, { medicine: -1, health: 7, morale: 2, food: -2 }, "By evening, the fever begins to break.") },
      { label: "Rely on rest alone", hint: "Conserve medicine", effect: s => chance(.52) ? change(s, { health: -3, food: -2 }, "A long day under the mosquito net helps.") : change(s, { health: -12, morale: -5 }, "The fever lingers and worries the whole crew.") }
    ]
  },
  {
    title: "A canopy commotion",
    copy: "Branches shake overhead. A troop of tiny primates follows the canoe from tree to tree.",
    choices: [
      { label: "Stop to sketch them", hint: "Journal discovery", effect: s => discover(s, "tamarin", "You capture the tamarins' bright faces and restless energy.") },
      { label: "Share a little fruit", hint: "Use 3 food", effect: s => change(s, { food: -3, morale: 7 }, "The crew laughs as the boldest tamarin investigates.") }
    ]
  },
  {
    title: "The engine coughs",
    copy: "The small auxiliary motor sputters in a fast channel. A fuel line has worked loose.",
    choices: [
      { label: "Repair it properly", hint: "Lose half a day", effect: s => change(s, { boat: 8, food: -2, day: 1 }, "The line is cleaned, tightened, and tested.") },
      { label: "Tie it off and continue", hint: "Save time", effect: s => chance(.58) ? change(s, { progress: 22 }, "The improvised fix holds for now.") : change(s, { fuel: -10, boat: -6 }, "Fuel leaks into the bilge before you catch it.") }
    ]
  }
];

const roles = {
  naturalist: { label: "Naturalist", symbol: "✦" },
  medic: { label: "Medic", symbol: "✚" },
  navigator: { label: "Navigator", symbol: "⌁" }
};

let state = null;
let audio = null;
let toastTimer = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const chance = n => Math.random() < n;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function initialState(name, role) {
  return { name: name || "Explorer", role, day: 1, progress: 0, health: 100, morale: 88, boat: 100, food: 70, medicine: 6, fuel: 55, trade: 8, pace: "steady", weather: 0, found: [], lastStop: 0, finished: false };
}

function change(s, delta, message) {
  Object.entries(delta).forEach(([key, value]) => s[key] = (s[key] || 0) + value);
  return message;
}

function discover(s, animalId, message) {
  if (!s.found.includes(animalId)) s.found.push(animalId);
  if (s.role === "naturalist") s.morale += 3;
  return message;
}

function initJournal() {
  $("#journal-grid").innerHTML = ANIMALS.map(a => `<div class="animal" data-animal="${a.id}" title="Undiscovered species">?</div>`).join("");
}

function beginGame(saved = null) {
  if (saved) state = saved;
  else {
    const name = $("#captain-name").value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    state = initialState(name, role);
  }
  $("#start-screen").hidden = true;
  $("#game-screen").hidden = false;
  $("#setup-form").hidden = true;
  initRoute();
  render();
  save();
}

function initRoute() {
  $("#route-stops").innerHTML = STOPS.map((s, i) => `<li data-stop="${i}"><b>${s.name}</b><small>${s.km.toLocaleString()} km</small></li>`).join("");
}

function render() {
  if (!state) return;
  const pct = clamp(state.progress / 1340 * 100);
  $("#distance-label").textContent = `${Math.max(0, 1340 - Math.round(state.progress)).toLocaleString()} km left`;
  $("#route-progress").style.width = `${pct * .86}%`;
  $("#boat-marker").style.left = `calc(7% + ${pct * .86}% - 7px)`;
  $$("#route-stops li").forEach((li, i) => {
    li.classList.toggle("reached", state.progress >= STOPS[i].km);
    li.classList.toggle("current", i === currentStop());
  });
  $("#field-note").textContent = STOPS[currentStop()].note;
  $("#day-number").textContent = state.day;
  $("#leader-label").textContent = state.name.toUpperCase();
  $("#role-label").textContent = roles[state.role].label;
  $("#role-symbol").textContent = roles[state.role].symbol;
  const status = state.health < 35 ? "Crew needs urgent care" : state.morale < 35 ? "Crew spirits are low" : state.boat < 35 ? "Canoe needs repair" : "Crew in good spirits";
  $("#crew-status").textContent = status;
  ["health", "morale", "boat"].forEach(key => {
    state[key] = clamp(state[key]);
    $(`#${key}-value`).textContent = Math.round(state[key]);
    const meter = $(`#${key}-meter`);
    if (meter) {
      meter.style.width = `${state[key]}%`;
      meter.style.background = state[key] < 30 ? "#7a121e" : state[key] < 60 ? "#d97a34" : "repeating-linear-gradient(90deg,#d43c46 0 9px,#f06b63 9px 12px)";
    }
  });
  ["food", "medicine", "fuel", "trade"].forEach(key => {
    state[key] = Math.max(0, Math.round(state[key]));
    $(`#${key}-value`).textContent = state[key];
  });
  const weather = WEATHER[state.weather];
  $("#weather-icon").textContent = weather.icon;
  $("#weather-label").textContent = `${weather.label} • ${weather.temp}°C`;
  $("#location-label").textContent = `Near ${STOPS[currentStop()].name}`;
  $("#readout-location").textContent = STOPS[currentStop()].name;
  $("#journal-count").textContent = `${state.found.length} / ${ANIMALS.length}`;
  ANIMALS.forEach(a => {
    const el = $(`[data-animal="${a.id}"]`);
    if (!el) return;
    const found = state.found.includes(a.id);
    el.classList.toggle("found", found);
    el.textContent = found ? a.icon : "?";
    el.title = found ? a.name : "Undiscovered species";
  });
  $$('[data-pace]').forEach(b => b.classList.toggle("active", b.dataset.pace === state.pace));
  save();
}

function currentStop() {
  let current = 0;
  STOPS.forEach((s, i) => { if (state.progress >= s.km) current = i; });
  return current;
}

function useDay(kind) {
  if (!state || state.finished) return;
  let message = "";
  let title = "Camp along the river";
  state.day += 1;
  if (kind === "travel") {
    const pace = { careful: { d: [38, 58], food: 3, fuel: 2, morale: 0 }, steady: { d: [54, 78], food: 4, fuel: 3, morale: -1 }, urgent: { d: [74, 105], food: 6, fuel: 5, morale: -4 } }[state.pace];
    let distance = pace.d[0] + Math.random() * (pace.d[1] - pace.d[0]);
    if (state.role === "navigator") distance *= 1.13;
    distance *= 1 - WEATHER[state.weather].risk * .045;
    state.progress += distance;
    state.food -= pace.food;
    state.fuel -= pace.fuel;
    state.morale += pace.morale;
    if (state.pace === "urgent" && chance(.28)) state.boat -= 5;
    title = pick(["A ribbon through the green", "The current carries you east", "Another bend in the river", "Deeper into the floodplain"]);
    message = `You make ${Math.round(distance)} km before finding a safe landing.`;
    maybeStop();
    if (chance(.42)) setTimeout(() => showEvent(pick(EVENTS)), 650);
  } else if (kind === "fish") {
    const gain = chance(.72) ? 8 + Math.floor(Math.random() * 10) : 0;
    state.food += gain; state.morale += gain ? 2 : -2;
    title = gain ? "A silver catch" : "An empty net";
    message = gain ? `The net brings in enough fish for ${gain} food.` : "The fish stay deep today. You return with only wet line.";
    if (chance(.22)) discover(state, "caiman", "A spectacled caiman watches from a half-submerged log.");
  } else if (kind === "forage") {
    const gain = chance(.65) ? 5 + Math.floor(Math.random() * 9) : 0;
    state.food += gain; state.health += gain ? 1 : -3;
    title = gain ? "Forest provisions" : "Thorns and mosquitoes";
    message = gain ? `Careful identification adds ${gain} food without harming the grove.` : "The team turns back before finding anything safe to eat.";
    if (chance(state.role === "naturalist" ? .48 : .23)) discover(state, pick(["sloth", "toucan", "macaw", "capybara"]), "A patient observation adds a new species to the journal.");
  } else if (kind === "rest") {
    let heal = state.role === "medic" ? 13 : 8;
    state.health += heal; state.morale += 6; state.food -= 3;
    if (state.medicine > 0 && state.health < 55) { state.medicine -= 1; state.health += 5; }
    if (state.boat < 75) state.boat += 4;
    title = "A day beneath the canopy";
    message = "Clothes dry, tools are checked, and the crew sleeps past sunrise.";
  }
  applyDailyPressure();
  state.weather = weightedWeather();
  updateScene(title, message);
  render();
  checkEnd();
}

function applyDailyPressure() {
  if (state.food <= 0) { state.health -= 11; state.morale -= 7; }
  if (state.fuel <= 0) { state.morale -= 2; }
  state.health -= WEATHER[state.weather].risk * .45;
}

function weightedWeather() {
  const r = Math.random();
  return r < .4 ? 0 : r < .7 ? 1 : r < .91 ? 2 : 3;
}

function maybeStop() {
  const now = currentStop();
  if (now > state.lastStop) {
    state.lastStop = now;
    state.morale += 6;
    state.trade += 1;
    toast(`Reached ${STOPS[now].name} • morale +6 • trade goods +1`);
  }
}

function updateScene(title, message) {
  $("#scene-message").innerHTML = `<span>FIELD LOG • DAY ${state.day}</span><h2>${title}</h2><p>${message}</p>`;
  $("#scene").classList.remove("flash");
  requestAnimationFrame(() => $("#scene").classList.add("flash"));
}

function showEvent(event) {
  if (!state || state.finished) return;
  $("#event-title").textContent = event.title;
  $("#event-copy").textContent = event.copy;
  $("#event-choices").innerHTML = "";
  event.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-choice";
    button.innerHTML = `<span>${choice.label}</span><small>${choice.hint}</small>`;
    button.disabled = choice.disabled?.(state) || false;
    button.addEventListener("click", () => {
      const result = choice.effect(state);
      $("#event-dialog").close();
      updateScene(event.title, result);
      render();
      checkEnd();
    });
    $("#event-choices").append(button);
  });
  $("#event-dialog").showModal();
}

function checkEnd() {
  if (state.progress >= 1340) return finish(true);
  if (state.health <= 0 || state.morale <= 0 || state.boat <= 0) return finish(false);
}

function finish(success) {
  state.finished = true;
  localStorage.removeItem("riverbound-save");
  const score = Math.max(0, Math.round(state.progress + state.health * 4 + state.morale * 3 + state.boat * 2 + state.found.length * 120 - state.day * 5));
  $("#end-kicker").textContent = success ? "EXPEDITION COMPLETE" : "EXPEDITION ENDED";
  $("#end-title").textContent = success ? "Santarém at last" : "The river turns you back";
  $("#end-copy").textContent = success ? `After ${state.day} days, ${state.name}'s crew reaches Santarém with ${state.found.length} wildlife observations in the journal.` : `The crew cannot safely continue. You charted ${Math.round(state.progress)} km in ${state.day} days—and every hard lesson will shape the next attempt.`;
  $("#score-grid").innerHTML = `<div><b>${score}</b><small>Score</small></div><div><b>${state.day}</b><small>Days</small></div><div><b>${state.found.length}</b><small>Species</small></div>`;
  $("#end-dialog").showModal();
}

function save() {
  if (state && !state.finished) localStorage.setItem("riverbound-save", JSON.stringify(state));
}

function resetGame() {
  localStorage.removeItem("riverbound-save");
  state = null;
  $("#end-dialog").close();
  $("#event-dialog").open && $("#event-dialog").close();
  $("#game-screen").hidden = true;
  $("#start-screen").hidden = false;
  $("#setup-form").hidden = true;
  checkSaved();
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

function checkSaved() {
  const saved = localStorage.getItem("riverbound-save");
  $("#continue-btn").disabled = !saved;
}

function toggleSound() {
  const btn = $("#sound-btn");
  if (audio) {
    audio.ctx.close(); audio = null; btn.setAttribute("aria-pressed", "false"); btn.innerHTML = "<u>S</u>ound: Off"; return;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const gain = ctx.createGain(); gain.gain.value = .035; gain.connect(ctx.destination);
  const oscillator = ctx.createOscillator(); oscillator.type = "sine"; oscillator.frequency.value = 96;
  const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain(); lfo.frequency.value = .11; lfoGain.gain.value = 13;
  lfo.connect(lfoGain); lfoGain.connect(oscillator.frequency); oscillator.connect(gain); oscillator.start(); lfo.start();
  audio = { ctx, oscillator, lfo }; btn.setAttribute("aria-pressed", "true"); btn.innerHTML = "<u>S</u>ound: On";
}

function openPanel(name) {
  if ((name === "map" || name === "supplies" || name === "album") && !state) {
    toast("Begin an expedition to open this record.");
    return;
  }
  const dialog = $(`#${name}-dialog`);
  if (dialog && !dialog.open) dialog.showModal();
}

$("#setup-form").addEventListener("submit", e => { e.preventDefault(); beginGame(); });
$("#continue-btn").addEventListener("click", () => { try { beginGame(JSON.parse(localStorage.getItem("riverbound-save"))); } catch { resetGame(); } });
$("#show-setup-btn").addEventListener("click", () => { $("#setup-form").hidden = false; $("#captain-name").focus(); });
$("#close-setup").addEventListener("click", () => { $("#setup-form").hidden = true; });
$("#new-game-btn").addEventListener("click", resetGame);
$("#play-again-btn").addEventListener("click", resetGame);
$("#sound-btn").addEventListener("click", toggleSound);
$$('[data-pace]').forEach(b => b.addEventListener("click", () => { if (!state) return; state.pace = b.dataset.pace; render(); }));
$$('[data-action]').forEach(b => b.addEventListener("click", () => useDay(b.dataset.action)));
$$('[data-open]').forEach(b => b.addEventListener("click", () => openPanel(b.dataset.open)));
window.addEventListener("beforeunload", save);

initJournal();
checkSaved();

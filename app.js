const TOTAL = 4600;
const STOPS = [
  { name: "Belém", km: 0, note: "The great estuary opens to the Atlantic; your journey begins upriver." },
  { name: "Xingu River", km: 300, note: "The Xingu joins the Amazon from the south, carrying clear water through ancient rock." },
  { name: "Santarém", km: 620, note: "The Tapajós meets the Amazon at Santarém in a striking contrast of waters." },
  { name: "Trombetas", km: 920, note: "Black-water tributaries drain forest soils rich in dissolved organic matter." },
  { name: "Madeira River", km: 1250, note: "The Madeira delivers Andean sediments to the great river." },
  { name: "Manaus", km: 1550, note: "At the Meeting of Waters, the Negro and Solimões run side by side before mixing." },
  { name: "Purus River", km: 1870, note: "A winding floodplain shelters fish among flooded trees." },
  { name: "Tefé", km: 2200, note: "Lakes and channels make this reach a maze in the high-water season." },
  { name: "Içá River", km: 2510, note: "The upper river is narrower, and its bends become harder to read." },
  { name: "Leticia", km: 2800, note: "Three countries meet near this stretch of the upper Amazon." },
  { name: "Iquitos", km: 3150, note: "Forest and river are the routes into this Peruvian city." },
  { name: "Marañón River", km: 3490, note: "The river system climbs toward its Andean headwaters." },
  { name: "Pucallpa", km: 3830, note: "The landscape changes as the lowland forest gives way to foothills." },
  { name: "Apurímac River", km: 4200, note: "The final ascent follows waters running down from the Andes." },
  { name: "Vilcabamba", km: TOTAL, note: "A hidden destination at the end of this time-bent expedition." }
];
const MAP_POINTS = [[867,285],[768,300],[667,306],[600,289],[536,263],[470,236],[382,240],[305,238],[246,240],[210,248],[176,272],[148,335],[130,403],[144,451],[161,485]];

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
      { label: "Ease off and pole around", hint: "Lose time", effect: s => change(s, { food: -2, morale: -1 }, "Slow, careful work gets everyone through safely.") }
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
    title: "A torn paddle lash",
    copy: "The current strains the canoe as a paddle lash begins to fray. The crew can stop to repair it properly.",
    choices: [
      { label: "Repair it properly", hint: "Lose a day", effect: s => change(s, { boat: 8, food: -2, day: 1 }, "The cord is replaced, and the paddle bites cleanly again.") },
      { label: "Tie it off and continue", hint: "Save time", effect: s => chance(.58) ? change(s, { progress: 22 }, "The improvised fix holds for now.") : change(s, { boat: -9, morale: -3 }, "The lash parts in rough water and the hull strikes a root.") }
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
let travelling = false, travelStart = 0, travelDistance = 0, steer = .5, sceneTime = 0, lastFrame = 0;
let steerKeys = { left: false, right: false }, hazards = [], sighting = null, fishing = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const chance = n => Math.random() < n;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function initialState(name, role) {
  return { version: 3, name: name || "Explorer", role, day: 1, progress: 0, health: 100, morale: 88, boat: 100, food: 165, medicine: 6, fuel: 55, trade: 8, pace: "steady", weather: 0, found: [], lastStop: 0, finished: false };
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
  if (saved) {
    state = saved;
    if (!state.version) {
      state.progress = Math.round(clamp(state.progress / 1340, 0, 1) * TOTAL);
      state.lastStop = 0;
      state.version = 3;
      state.finished = false;
      toast("Your earlier expedition was carried onto the new upriver chart.");
    }
  }
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
  if (localStorage.getItem("riverbound-muted") !== "yes" && !audio) startAudio();
}

function initRoute() {
  $("#route-stops").innerHTML = STOPS.map((s, i) => [0,2,5,10,12,14].includes(i) ? `<li data-stop="${i}" style="left:${MAP_POINTS[i][0]/10}%;top:${MAP_POINTS[i][1]/6}%"><b>${s.name}</b></li>` : "").join("");
  $("#map-dots").innerHTML = STOPS.map((s,i) => `<circle cx="${MAP_POINTS[i][0]}" cy="${MAP_POINTS[i][1]}" r="${[0,2,5,10,14].includes(i) ? 8 : 5}" class="map-dot" data-dot="${i}"/>`).join("");
  const path = $("#route-done"), len = path.getTotalLength();
  path.style.strokeDasharray = `${len} ${len}`;
  path.style.strokeDashoffset = len;
}

function render() {
  if (!state) return;
  const pct = clamp(state.progress / TOTAL, 0, 1);
  $("#distance-label").textContent = `${Math.round(state.progress).toLocaleString()} km`;
  const path = $("#route-done"), len = path.getTotalLength();
  path.style.strokeDashoffset = len * (1 - pct);
  const point = path.getPointAtLength(len * pct);
  $("#map-boat").setAttribute("transform", `translate(${point.x} ${point.y})`);
  $$("#route-stops li").forEach(li => {
    const n = Number(li.dataset.stop);
    li.classList.toggle("reached", state.progress >= STOPS[n].km);
    li.classList.toggle("current", n === currentStop());
  });
  $$(".map-dot").forEach(dot => dot.classList.toggle("reached", state.progress >= STOPS[Number(dot.dataset.dot)].km));
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
  $("#scene").dataset.weather = state.weather;
  $("#map-caption").textContent = `${Math.round(state.progress).toLocaleString()} of ${TOTAL.toLocaleString()} game km upriver • ${STOPS[currentStop()].name} • illustrated route, not a navigational chart.`;
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
  if (!state || state.finished || travelling || $("#event-dialog").open || $("#fishing-dialog").open) return;
  if (kind === "travel") return startTravel();
  if (kind === "camera") return photograph();
  if (kind === "fish") return startFishing();
  let message = "";
  let title = "Camp along the river";
  state.day += 1;
  if (kind === "forage") {
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
  soundCue(kind === "rest" ? "camp" : "discover");
  render();
  checkEnd();
}

function startTravel() {
  const pace = { careful: { d: [92,118], food: 3, fuel: 1, morale: 0, hazards: 2 }, steady: { d: [112,144], food: 4, fuel: 1, morale: -1, hazards: 3 }, urgent: { d: [142,174], food: 6, fuel: 2, morale: -3, hazards: 4 } }[state.pace];
  travelDistance = (pace.d[0] + Math.random() * (pace.d[1] - pace.d[0])) * (state.role === "navigator" ? 1.12 : 1) * (1 - WEATHER[state.weather].risk * .04);
  travelling = true; travelStart = performance.now(); steer = .5;
  hazards = Array.from({length: pace.hazards}, (_,i) => ({x: .23 + Math.random()*.54, start: .18 + i*.19, hit:false, type: i%3===1 ? "eddy" : "log"}));
  $("#scene").classList.add("moving"); $("#scene-message").hidden = true;
  $("#travel-hud").hidden = false; $("#steer-controls").hidden = false;
  $$("[data-action], [data-pace]").forEach(b => b.disabled = true);
  soundCue("paddle");
}

function endTravel() {
  if (!travelling || !state) return;
  travelling = false;
  const pace = {careful:[3,1,0],steady:[4,1,-1],urgent:[6,2,-3]}[state.pace];
  state.day++; state.progress += travelDistance; state.food -= pace[0]; state.fuel -= pace[1]; state.morale += pace[2];
  applyDailyPressure(); state.weather = weightedWeather();
  const reached = maybeStop();
  $("#scene").classList.remove("moving"); $("#scene-message").hidden = false;
  $("#travel-hud").hidden = true; $("#steer-controls").hidden = true;
  $$("[data-action], [data-pace]").forEach(b => b.disabled = false);
  if (reached) {
    $("#scene").classList.add("mist-arrival");
    setTimeout(() => $("#scene").classList.remove("mist-arrival"), 2000);
    soundCue("mist");
  }
  updateScene(reached ? `Through the blue mist: ${STOPS[currentStop()].name}` : pick(["A ribbon through the green", "The current carries you west", "Another bend in the river", "Deeper into the floodplain"]), `You make ${Math.round(travelDistance)} km upriver before finding a safe landing.`);
  if (chance(.54) && !sighting) showSighting();
  render();
  checkEnd();
  if (!state.finished && chance(.39)) setTimeout(() => { if (!travelling && !$("#fishing-dialog").open) showEvent(pick(EVENTS)); }, 650);
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
    return true;
  }
  return false;
}

function updateScene(title, message) {
  $("#scene-message").innerHTML = `<span>FIELD LOG • DAY ${state.day}</span><h2>${title}</h2><p>${message}</p>`;
  $("#scene").classList.remove("flash");
  requestAnimationFrame(() => $("#scene").classList.add("flash"));
}

function showEvent(event) {
  if (!state || state.finished || travelling || $("#event-dialog").open) return;
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
      soundCue("choice");
      render();
      checkEnd();
    });
    $("#event-choices").append(button);
  });
  $("#event-dialog").showModal();
}

function checkEnd() {
  if (state.progress >= TOTAL) return finish(true);
  if (state.health <= 0 || state.morale <= 0 || state.boat <= 0) return finish(false);
}

function finish(success) {
  if (state.finished) return;
  state.finished = true;
  localStorage.removeItem("riverbound-save");
  const score = Math.max(0, Math.round(state.progress + state.health * 4 + state.morale * 3 + state.boat * 2 + state.found.length * 120 - state.day * 5));
  $("#end-kicker").textContent = success ? "EXPEDITION COMPLETE" : "EXPEDITION ENDED";
  $("#end-title").textContent = success ? "The hidden city at last" : "The river turns you back";
  $("#end-copy").textContent = success ? `After ${state.day} days, ${state.name}'s crew reaches Vilcabamba with ${state.found.length} wildlife observations in the journal.` : `The crew cannot safely continue. You charted ${Math.round(state.progress)} km in ${state.day} days—and every hard lesson will shape the next attempt.`;
  $("#score-grid").innerHTML = `<div><b>${score}</b><small>Score</small></div><div><b>${state.day}</b><small>Days</small></div><div><b>${state.found.length}</b><small>Species</small></div>`;
  $("#end-dialog").showModal();
  soundCue(success ? "victory" : "damage");
}

function save() {
  if (state && !state.finished) localStorage.setItem("riverbound-save", JSON.stringify(state));
}

function resetGame() {
  travelling = false;
  localStorage.removeItem("riverbound-save");
  state = null;
  $("#end-dialog").close();
  $("#event-dialog").open && $("#event-dialog").close();
  $("#fishing-dialog").open && $("#fishing-dialog").close();
  $("#scene").classList.remove("moving", "mist-arrival");
  $("#scene-message").hidden = false;
  $("#travel-hud").hidden = true; $("#steer-controls").hidden = true;
  $("#sighting-btn").hidden = true; sighting = null;
  $$("[data-action], [data-pace]").forEach(b => b.disabled = false);
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
  if (audio) { stopAudio(); localStorage.setItem("riverbound-muted", "yes"); }
  else { startAudio(); localStorage.setItem("riverbound-muted", "no"); }
}

function startAudio() {
  if (audio) { audio.ctx.resume(); return; }
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) { toast("This browser does not support game audio."); return; }
  try {
    const ctx = new Context(), master = ctx.createGain(); master.gain.value = .3; master.connect(ctx.destination);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0); for (let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
    const source = ctx.createBufferSource(); source.buffer = buffer; source.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 360;
    const river = ctx.createGain(); river.gain.value = .12;
    source.connect(filter); filter.connect(river); river.connect(master); source.start();
    audio = {ctx, master, source, interval: setInterval(() => {
      if (!audio || document.hidden || !state || state.finished) return;
      if (Math.random() < .75) birdCall();
      if (state.weather > 1 && Math.random() < .3) soundCue("rain");
    }, 2300)};
    $("#sound-btn").setAttribute("aria-pressed", "true"); $("#sound-btn").innerHTML = "<u>S</u>ound: On";
  } catch { toast("Audio could not be started here."); }
}
function stopAudio() {
  if (!audio) return;
  clearInterval(audio.interval); audio.ctx.close(); audio = null;
  $("#sound-btn").setAttribute("aria-pressed", "false"); $("#sound-btn").innerHTML = "<u>S</u>ound: Off";
}
function tone(frequency, duration=.12, type="sine", volume=.16, delay=0, endFrequency=null) {
  if (!audio) return;
  const {ctx,master} = audio, now=ctx.currentTime+delay, osc=ctx.createOscillator(), gain=ctx.createGain();
  osc.type=type; osc.frequency.setValueAtTime(frequency,now);
  if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency,now+duration);
  gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(volume,now+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain); gain.connect(master); osc.start(now); osc.stop(now+duration+.02);
}
function burst(duration=.18, frequency=1000, volume=.12) {
  if (!audio) return;
  const {ctx,master}=audio, n=Math.floor(ctx.sampleRate*duration), buffer=ctx.createBuffer(1,n,ctx.sampleRate), data=buffer.getChannelData(0);
  for(let i=0;i<n;i++) data[i]=(Math.random()*2-1)*(1-i/n);
  const source=ctx.createBufferSource(), filter=ctx.createBiquadFilter(), gain=ctx.createGain();
  source.buffer=buffer; filter.type="lowpass"; filter.frequency.value=frequency; gain.gain.value=volume;
  source.connect(filter); filter.connect(gain); gain.connect(master); source.start();
}
function birdCall() { const f=1100+Math.random()*500; tone(f,.09,"sine",.09,0,f*1.45); tone(f*1.22,.12,"sine",.07,.15,f*.85); }
function soundCue(kind) {
  if (!audio) return;
  if (kind==="paddle") { burst(.3,420,.19); tone(125,.2,"triangle",.08); }
  if (kind==="damage") { burst(.38,230,.32); tone(185,.4,"sawtooth",.12,0,65); }
  if (kind==="splash") { burst(.42,850,.22); tone(430,.18,"sine",.11,0,130); }
  if (kind==="camera") { burst(.08,2300,.3); tone(720,.055,"square",.08); }
  if (kind==="mist") { [330,415,494,660].forEach((f,i)=>tone(f,.58,"sine",.075,i*.18)); }
  if (kind==="discover") { [520,660,784].forEach((f,i)=>tone(f,.18,"triangle",.11,i*.12)); }
  if (kind==="choice") tone(440,.09,"triangle",.1);
  if (kind==="camp") { tone(260,.34,"sine",.1); burst(.24,650,.06); }
  if (kind==="rain") burst(.75,1600,.075);
  if (kind==="victory") [392,523,659,784,1046].forEach((f,i)=>tone(f,.35,"triangle",.15,i*.15));
}

function showSighting() {
  const unseen = ANIMALS.filter(a => !state.found.includes(a.id));
  sighting = pick(unseen.length ? unseen : ANIMALS);
  $("#sighting-name").textContent = sighting.name;
  $("#sighting-icon").textContent = sighting.icon;
  $("#sighting-btn").hidden = false;
  birdCall();
}
function photograph() {
  if (!sighting) { toast("Watch the river for a wildlife sighting first."); return; }
  soundCue("camera");
  const animal=sighting; sighting=null; $("#sighting-btn").hidden=true;
  discover(state,animal.id,`A clear photograph of the ${animal.name.toLowerCase()} is added to your album.`);
  updateScene("A moment in the wild", `A clear photograph of the ${animal.name.toLowerCase()} is added to your album.`);
  render(); toast(`${animal.name} documented!`);
}

function startFishing() {
  fishing={start:performance.now(),aimX:320,aimY:153,fishX:320,fishY:150,logX:100};
  $("#fishing-tip").textContent="Click the water or press SPACE to cast.";
  $("#fishing-dialog").showModal(); soundCue("splash");
}
function cast() {
  if (!fishing || !state) return;
  const {aimX,aimY,fishX,fishY,logX}=fishing;
  const logHit=Math.abs(aimX-logX)<42 && Math.abs(aimY-98)<23;
  const caught=!logHit && Math.hypot(aimX-fishX,aimY-fishY)<60;
  state.day++; state.food-=2;
  let title,message;
  if (logHit) { state.boat-=3; title="A broken harpoon"; message="The point strikes a drifting log. The fish scatter and the crew repairs the gear."; soundCue("damage"); }
  else if (caught) { const gain=16+Math.floor(Math.random()*17); state.food+=gain; state.morale+=3; title="A catch from the river"; message=`A fish provides ${gain} food for the crew. The river offers, but never without patience.`; soundCue("discover"); }
  else { state.morale-=1; title="The fish scatter"; message="The harpoon cuts only water. The crew will try another bend tomorrow."; soundCue("splash"); }
  fishing=null; $("#fishing-dialog").close(); applyDailyPressure(); state.weather=weightedWeather();
  updateScene(title,message); render(); checkEnd();
}

const riverCanvas=$("#river-canvas"), riverCtx=riverCanvas.getContext("2d"), fishingCanvas=$("#fishing-canvas"), fishingCtx=fishingCanvas.getContext("2d");
function drawScene(t,dt) {
  if ($( "#game-screen").hidden) return;
  const w=riverCanvas.clientWidth,h=riverCanvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if (riverCanvas.width!==Math.round(w*dpr)||riverCanvas.height!==Math.round(h*dpr)) {riverCanvas.width=Math.round(w*dpr);riverCanvas.height=Math.round(h*dpr);}
  riverCtx.setTransform(dpr,0,0,dpr,0,0); riverCtx.clearRect(0,0,w,h);
  const c=riverCtx; sceneTime+=dt;
  if (travelling) {
    steer=clamp(steer+((steerKeys.right?1:0)-(steerKeys.left?1:0))*dt*.00033,.18,.82);
    const p=Math.min(1,(t-travelStart)/5400);
    $("#travel-progress").style.width=`${p*100}%`;
    $("#scene").style.setProperty("--steer",`${(steer-.5)*-18}px`);
    if(p>=1) endTravel();
    hazards.forEach(hazard=>{
      const z=(p-hazard.start)*3.2;
      if(z<=0||z>1.2) return;
      const scale=.25+z*1.7, x=w*(.5+(hazard.x-steer)*(.45+z*.62)), y=h*(.47+z*.38);
      c.save(); c.translate(x,y); c.scale(scale,scale);
      if(hazard.type==="log") {
        c.rotate(-.13); c.fillStyle="#30291b"; c.strokeStyle="#c0a66a"; c.lineWidth=3;
        c.beginPath(); c.roundRect(-39,-6,78,12,6); c.fill(); c.stroke();
        c.strokeStyle="#71583a"; c.beginPath(); c.moveTo(-28,-3);c.lineTo(28,-3);c.stroke();
      } else {
        for(let j=0;j<3;j++){c.strokeStyle=`rgba(209,232,216,${.65-j*.14})`;c.lineWidth=2;c.beginPath();c.ellipse(0,0,18+j*13,4+j*4,0,0,Math.PI*1.8);c.stroke();}
      }
      c.restore();
      if(!hazard.hit&&z>.84) {
        hazard.hit=true;
        if(Math.abs(hazard.x-steer)<(hazard.type==="log"?.115:.09)) {
          state.boat-=hazard.type==="log"?12:8; state.morale-=3; soundCue("damage");
          $("#scene").classList.remove("collision"); void $("#scene").offsetWidth; $("#scene").classList.add("collision");
          toast(hazard.type==="log"?"Log strike! Canoe -12":"Whirlpool! Canoe -8"); render();
        } else soundCue("splash");
      }
    });
  }
  for(let i=0;i<17;i++) {
    const y=h*(.49+((i*.071+sceneTime*(travelling?.00013:.000027))%.46));
    const x=w*(.08+((i*.341+Math.sin(i*28+sceneTime*.0004)*.09)% .84));
    c.strokeStyle=i%3===0?"rgba(255,230,141,.38)":"rgba(198,231,216,.18)";
    c.lineWidth=1+(y/h)*2;c.beginPath();c.moveTo(x,y);c.lineTo(x+18+(y/h)*31,y);c.stroke();
  }
  for(let i=0;i<3;i++) {
    const x=w*(.18+((i*.37+sceneTime*.000013)%.75)),y=h*(.15+i*.045+Math.sin(sceneTime*.002+i)*.012);
    c.strokeStyle="rgba(13,39,38,.7)";c.lineWidth=2;c.beginPath();c.moveTo(x-7,y+2);c.quadraticCurveTo(x,y-4,x+4,y+2);c.quadraticCurveTo(x+10,y-4,x+16,y+2);c.stroke();
  }
  if(state?.weather>=2) {
    c.strokeStyle=state.weather===3?"rgba(227,243,238,.27)":"rgba(227,243,238,.15)";c.lineWidth=1;
    for(let i=0;i<(state.weather===3?90:45);i++){const x=((i*71+sceneTime*.23)% (w+80))-40,y=((i*53+sceneTime*.4)%(h+40))-20;c.beginPath();c.moveTo(x,y);c.lineTo(x-5,y+13);c.stroke();}
  }
}
function drawFishing(t) {
  if(!fishing) return;
  const c=fishingCtx,w=640,h=280,elapsed=(t-fishing.start)*.001;
  const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,"#225f64");grad.addColorStop(1,"#092c32");c.fillStyle=grad;c.fillRect(0,0,w,h);
  for(let i=0;i<22;i++){let x=(i*83+elapsed*35)%690-25,y=30+i*11;c.strokeStyle="rgba(142,210,204,.3)";c.beginPath();c.ellipse(x,y,16,2,0,0,Math.PI);c.stroke();}
  fishing.fishX=320+Math.sin(elapsed*1.5)*190; fishing.fishY=150+Math.sin(elapsed*2.6)*40;
  fishing.logX=100+((elapsed*45)%480);
  c.fillStyle="#5f4327";c.strokeStyle="#ba9560";c.lineWidth=3;c.beginPath();c.roundRect(fishing.logX-38,92,76,14,5);c.fill();c.stroke();
  c.save();c.translate(fishing.fishX,fishing.fishY);c.scale(Math.sin(elapsed*1.5)>0?1:-1,1);
  c.fillStyle="#6caaa4";c.strokeStyle="#b4dad0";c.lineWidth=2;c.beginPath();c.ellipse(0,0,44,17,0,0,Math.PI*2);c.fill();c.stroke();
  c.beginPath();c.moveTo(-36,0);c.lineTo(-62,-20);c.lineTo(-60,20);c.closePath();c.fill();
  c.fillStyle="#112b2c";c.beginPath();c.arc(24,-5,3,0,Math.PI*2);c.fill();c.restore();
  c.strokeStyle="rgba(239,227,146,.9)";c.lineWidth=2;c.beginPath();c.arc(fishing.aimX,fishing.aimY,14,0,Math.PI*2);c.moveTo(fishing.aimX-22,fishing.aimY);c.lineTo(fishing.aimX+22,fishing.aimY);c.moveTo(fishing.aimX,fishing.aimY-22);c.lineTo(fishing.aimX,fishing.aimY+22);c.stroke();
}
function animate(t) {const dt=Math.min(50,t-(lastFrame||t));lastFrame=t;drawScene(t,dt);drawFishing(t);requestAnimationFrame(animate);}
requestAnimationFrame(animate);

function openPanel(name) {
  if (travelling) { toast("Steer through this reach before opening a record."); return; }
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
$("#sighting-btn").addEventListener("click", photograph);
$("#close-fishing").addEventListener("click", () => { fishing=null; $("#fishing-dialog").close(); });
$("#cast-btn").addEventListener("click", cast);
fishingCanvas.addEventListener("pointermove", e => {if(!fishing)return;const r=fishingCanvas.getBoundingClientRect();fishing.aimX=(e.clientX-r.left)/r.width*640;fishing.aimY=(e.clientY-r.top)/r.height*280;});
fishingCanvas.addEventListener("click", e => {if(!fishing)return;const r=fishingCanvas.getBoundingClientRect();fishing.aimX=(e.clientX-r.left)/r.width*640;fishing.aimY=(e.clientY-r.top)/r.height*280;cast();});
$("#scene").addEventListener("pointermove", e => {if(!travelling||e.pointerType!=="mouse"||e.buttons!==1)return;const r=$("#scene").getBoundingClientRect();steer=clamp((e.clientX-r.left)/r.width,.18,.82);});
$("#scene").addEventListener("pointerdown", e => {if(!travelling||e.target.closest("button"))return;const r=$("#scene").getBoundingClientRect();steer=clamp((e.clientX-r.left)/r.width,.18,.82);$("#scene").setPointerCapture(e.pointerId);});
$("#scene").addEventListener("pointerup", e => {if($("#scene").hasPointerCapture(e.pointerId)) $("#scene").releasePointerCapture(e.pointerId);});
[["#steer-left","left"],["#steer-right","right"]].forEach(([selector,direction])=>{const b=$(selector);b.addEventListener("pointerdown",e=>{e.preventDefault();steerKeys[direction]=true;b.setPointerCapture(e.pointerId);});["pointerup","pointercancel","lostpointercapture"].forEach(type=>b.addEventListener(type,()=>steerKeys[direction]=false));});
window.addEventListener("keydown",e=>{
  if(fishing && (e.code==="Space"||e.code==="Enter")){e.preventDefault();cast();return;}
  if(!travelling)return;
  if(["ArrowLeft","ArrowRight","KeyA","KeyD"].includes(e.code))e.preventDefault();
  if(e.code==="ArrowLeft"||e.code==="KeyA")steerKeys.left=true;
  if(e.code==="ArrowRight"||e.code==="KeyD")steerKeys.right=true;
});
window.addEventListener("keyup",e=>{if(e.code==="ArrowLeft"||e.code==="KeyA")steerKeys.left=false;if(e.code==="ArrowRight"||e.code==="KeyD")steerKeys.right=false;});
window.addEventListener("blur",()=>{steerKeys.left=false;steerKeys.right=false;});
document.addEventListener("visibilitychange",()=>{if(audio){if(document.hidden)audio.ctx.suspend();else audio.ctx.resume();}});
window.addEventListener("beforeunload", save);

initJournal();
checkSaved();

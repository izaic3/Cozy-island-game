const grid = document.querySelector(".island-grid");
const story = document.getElementById("story");
const fishCount = document.getElementById("fish-count");
const woodCount = document.getElementById("wood-count");
const warmthCount = document.getElementById("warmth-count");
const cycleLabel = document.querySelector(".cycle-label");
const mergeProgress = document.getElementById("merge-progress");
const mergeText = document.getElementById("merge-text");
const explorePanel = document.getElementById("explore-panel");
const exploreGrid = document.querySelector(".explore-grid");
const timeStatus = document.getElementById("time-status");

const tiles = [
  "water",
  "water",
  "sand",
  "sand",
  "water",
  "water",
  "sand",
  "tree",
  "sand",
  "water",
  "sand",
  "tree",
  "sand",
  "tree",
  "sand",
  "water",
  "sand",
  "tree",
  "sand",
  "water",
  "water",
  "sand",
  "sand",
  "water",
  "water",
];

const exploreTiles = [
  "sand",
  "tree",
  "sand",
  "lagoon",
  "sand",
  "tree",
  "sand",
  "sand",
  "tree",
  "sand",
  "sand",
  "lagoon",
  "sand",
  "tree",
  "sand",
  "sand",
  "tree",
  "sand",
  "sand",
  "tree",
  "sand",
  "lagoon",
  "sand",
  "tree",
  "sand",
];

const state = {
  fish: 0,
  wood: 0,
  warmth: 0,
  day: 1,
  step: 0,
  merged: false,
};

const storySnippets = {
  fish: [
    "You cast your line and pull up a glittering fish.",
    "A small school swims by. Dinner is secured.",
  ],
  chop: [
    "You gather fallen branches and fragrant wood.",
    "A palm tree offers a few sturdy logs.",
  ],
  fire: [
    "The fire crackles, chasing away the chill.",
    "Warm light dances across the island.",
  ],
  hut: [
    "A tiny hut stands, woven from driftwood and leaves.",
    "You build a cozy shelter with a view of the sea.",
  ],
  drift: [
    "The tide hums softly. The horizon glows amber.",
    "Stars appear, mirrored in the water.",
  ],
  merge: [
    "At sunrise, another island drifts into view. New paths await.",
  ],
};

const progressSteps = [15, 30, 50, 70, 100];
const mergeMessages = [
  "Distance to the next island: Far away.",
  "The silhouette grows on the horizon.",
  "You can almost make out trees on the other shore.",
  "The waters narrow between the islands.",
  "The islands meet. New tiles appear!",
];

const randomFrom = (list) => list[Math.floor(Math.random() * list.length)];

const renderGrid = () => {
  grid.innerHTML = "";
  tiles.forEach((type, index) => {
    const tile = document.createElement("div");
    tile.className = `tile ${type}`;
    tile.style.opacity = index % 2 === 0 ? "0.95" : "1";
    grid.appendChild(tile);
  });
};

const renderExploreGrid = () => {
  exploreGrid.innerHTML = "";
  exploreTiles.forEach((type, index) => {
    const tile = document.createElement("div");
    tile.className = `tile ${type}`;
    tile.style.opacity = index % 2 === 0 ? "0.92" : "1";
    exploreGrid.appendChild(tile);
  });
};

const updateStats = () => {
  fishCount.textContent = state.fish;
  woodCount.textContent = state.wood;
  warmthCount.textContent = state.warmth;
};

const updateCycle = () => {
  const isNight = state.step % 2 === 1;
  const timeOfDay = isNight ? "Sunrise" : "Sunset";
  cycleLabel.textContent = `Day ${state.day} · ${timeOfDay} in ${3 - (state.step % 3)} steps`;
  document.body.classList.toggle("is-night", isNight);
  timeStatus.textContent = isNight
    ? "Night settles in. Stars guide your calm."
    : "Golden hour keeps the island bright.";
};

const updateMerge = () => {
  const progressIndex = Math.min(state.step, progressSteps.length - 1);
  mergeProgress.style.width = `${progressSteps[progressIndex]}%`;
  mergeText.textContent = mergeMessages[progressIndex];
  if (progressIndex === progressSteps.length - 1) {
    state.merged = true;
  }
};

const advanceTime = () => {
  state.step += 1;
  if (state.step % 3 === 0) {
    state.day += 1;
    story.textContent = randomFrom(storySnippets.drift);
  }
  updateCycle();
  updateMerge();
  if (state.merged) {
    story.textContent = storySnippets.merge[0];
    explorePanel.classList.add("is-visible");
    renderExploreGrid();
  }
};

const handleAction = (action) => {
  if (action === "fish") {
    state.fish += 1;
    story.textContent = randomFrom(storySnippets.fish);
  }
  if (action === "chop") {
    state.wood += 1;
    story.textContent = randomFrom(storySnippets.chop);
  }
  if (action === "fire" && state.wood > 0) {
    state.wood -= 1;
    state.warmth += 2;
    story.textContent = randomFrom(storySnippets.fire);
  }
  if (action === "hut" && state.wood >= 2) {
    state.wood -= 2;
    state.warmth += 1;
    story.textContent = randomFrom(storySnippets.hut);
  }
  updateStats();
  advanceTime();
};

renderGrid();
renderExploreGrid();
updateStats();
updateCycle();
updateMerge();

document.querySelectorAll("button[data-action]").forEach((button) => {
  button.addEventListener("click", () => handleAction(button.dataset.action));
});

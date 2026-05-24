const STARS = {
  pleiades: {
    name: "The Pleiades",
    tel: "A cluster of hot, young blue stars — the “Seven Sisters” — roughly 440 light-years away. Their distance and makeup are read from their light, not from any visit.",
    scr: "“Can you bind the chains of the Pleiades?” God names this very cluster and asks Job to do what only the Maker can.",
    ref: "Job 38:31"
  },
  orion: {
    name: "Orion",
    tel: "A constellation anchored by Betelgeuse, a dying red supergiant, and Rigel, a brilliant blue one — stars at very different stages of life.",
    scr: "“...or loose the cords of Orion?” Orion (Hebrew Kesil) is named beside the Pleiades as a work of God’s hand.",
    ref: "Job 38:31"
  },
  bear: {
    name: "The Bear",
    tel: "Ursa Major — the Great Bear. Its bright neighbor Arcturus is a red giant about 37 light-years from us.",
    scr: "“Can you guide the Bear with its children?” The King James Version renders this star “Arcturus.” God leads it; man cannot.",
    ref: "Job 38:32"
  },
  morning: {
    name: "The Morning Star",
    tel: "The “morning star” seen glowing at dawn is usually the planet Venus — not a star at all, but bright enough to be mistaken for one.",
    scr: "The title belongs to two: the one who fell (“O Day Star, son of Dawn”) and Christ who reigns (“the bright morning star”).",
    ref: "Isaiah 14:12 · Revelation 22:16"
  }
};

function selectStar(key) {
  const data = STARS[key];
  if (!data) return;
  document.getElementById("tel-body").textContent = data.tel;
  document.getElementById("scr-body").textContent = data.scr;
  document.getElementById("scr-ref").textContent = data.ref;
  document.querySelectorAll(".chip").forEach(c => {
    const on = c.dataset.star === key;
    c.classList.toggle("active", on);
    c.setAttribute("aria-selected", on ? "true" : "false");
  });
}

document.querySelectorAll(".chip").forEach(c => {
  c.addEventListener("click", () => selectStar(c.dataset.star));
});

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => showToast("Link copied to clipboard"))
    .catch(() => showToast("Couldn't copy — try manually"));
}

function shareNative() {
  if (navigator.share) {
    navigator.share({
      title: "What Are the Stars?",
      text: "Lights, signs, and the host of heaven — a study for the Growing Stone Fellowship",
      url: window.location.href
    });
  } else {
    copyLink();
  }
}

function showToast(m) {
  const t = document.getElementById("toast");
  t.textContent = m;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

selectStar("pleiades");

document.querySelectorAll(".persp-hdr").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".persp");
    const open = card.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

/* ---------- The Spectroscope ---------- */
const ELEMENTS = {
  hydrogen: { name: "Hydrogen", lines: [410, 434, 486, 656],
    note: "Hydrogen — the most abundant element in the stars. Its four Balmer lines are an unmistakable fingerprint." },
  helium:   { name: "Helium", lines: [447, 502, 588, 668],
    note: "Helium — its yellow line near 588nm was first seen in the sun's light in 1868, before helium was ever found on earth. It is named for Helios, the sun." },
  sodium:   { name: "Sodium", lines: [589, 590],
    note: "Sodium — a single strong pair of yellow lines, one of the easiest fingerprints to spot." },
  iron:     { name: "Iron", lines: [430, 438, 467, 495, 527, 532],
    note: "Iron — leaves dozens of fine dark lines. Their presence in a star's light tells us iron is there." },
  sun:      { name: "The Sun", lines: [410, 434, 467, 486, 527, 588, 589, 656],
    note: "The sun's spectrum is crossed by hundreds of dark 'Fraunhofer' lines — the combined fingerprints of every element in it, helium included. We read the sun's makeup without ever touching it." }
};

function nmToPct(nm) {
  return ((nm - 380) / 320) * 100;
}

function selectElement(key) {
  const data = ELEMENTS[key];
  if (!data) return;
  const band = document.getElementById("spec-band");
  if (!band) return;
  band.innerHTML = "";
  const tintFor1868 = (key === "helium" || key === "sun");
  data.lines.forEach(nm => {
    const line = document.createElement("div");
    line.className = "spec-line";
    if (tintFor1868 && nm >= 587 && nm <= 589) line.classList.add("gold-tint");
    line.style.left = nmToPct(nm) + "%";
    band.appendChild(line);
  });
  const note = document.getElementById("spec-note");
  if (note) note.textContent = data.note;
  document.querySelectorAll(".echip").forEach(c => {
    const on = c.dataset.elem === key;
    c.classList.toggle("active", on);
    c.setAttribute("aria-selected", on ? "true" : "false");
  });
}

document.querySelectorAll(".echip").forEach(c => {
  c.addEventListener("click", () => selectElement(c.dataset.elem));
});

selectElement("hydrogen");

/* ---------- The Canon Walk ---------- */
const WALK = [
  { ref: "Genesis 1:14", text: "Let there be lights in the expanse... for signs and for seasons.", gloss: "The stars are made as lights, and given a purpose." },
  { ref: "Deuteronomy 4:19", text: "...beware lest you... bow down to... the host of heaven.", gloss: "A warning: honor the Maker, not the made." },
  { ref: "Judges 5:20", text: "From heaven the stars fought... against Sisera.", gloss: "The stars fight from heaven." },
  { ref: "Job 38:7", text: "...the morning stars sang together and all the sons of God shouted for joy.", gloss: "Morning stars set in parallel with the sons of God." },
  { ref: "Job 38:31–32", text: "Can you bind the chains of the Pleiades, or loose the cords of Orion?", gloss: "God names the Pleiades, Orion, and the Bear." },
  { ref: "Psalm 19:1", text: "The heavens declare the glory of God.", gloss: "The skies proclaim His handiwork." },
  { ref: "Psalm 147:4", text: "He determines the number of the stars; he gives to all of them their names.", gloss: "Each star numbered and named." },
  { ref: "Isaiah 14:12", text: "How you are fallen from heaven, O Day Star, son of Dawn!", gloss: "The fall of the 'Day Star' (KJV 'Lucifer')." },
  { ref: "Isaiah 40:26", text: "...who brings out their host by number, calling them all by name.", gloss: "He calls the whole host by name." },
  { ref: "Ezekiel 1:16", text: "...their construction being as it were a wheel within a wheel.", gloss: "The wheels of the vision — circles within circles." },
  { ref: "Daniel 8:10", text: "...some of the host and some of the stars it threw down to the ground.", gloss: "A power casts down host and stars." },
  { ref: "Luke 10:18", text: "I saw Satan fall like lightning from heaven.", gloss: "A falling star as a falling spiritual power." },
  { ref: "Jude 1:13", text: "...wandering stars, for whom the gloom of utter darkness has been reserved forever.", gloss: "Wandering stars — the image behind the word 'planet.'" },
  { ref: "Revelation 1:20", text: "...the seven stars are the angels of the seven churches.", gloss: "Christ equates stars with angels." },
  { ref: "Revelation 9:1", text: "...I saw a star fallen from heaven to earth, and he was given the key...", gloss: "A fallen star spoken of as a person." },
  { ref: "Revelation 12:4", text: "His tail swept down a third of the stars of heaven...", gloss: "The dragon sweeps a third of the stars." },
  { ref: "Revelation 22:16", text: "I am... the bright morning star.", gloss: "The journey ends where all Scripture points — to Christ." }
];

let walkStep = 0;

function buildSky() {
  const sky = document.getElementById("walk-sky");
  if (!sky) return;
  sky.innerHTML = "";
  const inner = document.createElement("div");
  inner.className = "walk-sky-inner";
  WALK.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "walk-dot";
    dot.type = "button";
    if (i === WALK.length - 1) dot.classList.add("finale");
    dot.setAttribute("aria-label", "Jump to passage " + (i + 1) + " of " + WALK.length + ": " + WALK[i].ref);
    dot.addEventListener("click", () => { walkStep = i; renderWalk(); });
    inner.appendChild(dot);
  });
  sky.appendChild(inner);
}

function renderWalk() {
  const w = WALK[walkStep];
  if (!w) return;
  document.getElementById("walk-ref").textContent = w.ref;
  document.getElementById("walk-text").textContent = "“" + w.text + "”";
  document.getElementById("walk-gloss").textContent = w.gloss;
  document.getElementById("walk-pos").textContent = (walkStep + 1) + " of " + WALK.length;
  document.getElementById("walk-prev").disabled = (walkStep === 0);
  document.getElementById("walk-next").disabled = (walkStep === WALK.length - 1);
  document.getElementById("walk-closing").hidden = (walkStep !== WALK.length - 1);
  document.querySelectorAll(".walk-dot").forEach((d, i) => {
    d.classList.toggle("lit", i <= walkStep);
    d.classList.toggle("current", i === walkStep);
  });
}

buildSky();
document.getElementById("walk-prev").addEventListener("click", () => { if (walkStep > 0) { walkStep--; renderWalk(); } });
document.getElementById("walk-next").addEventListener("click", () => { if (walkStep < WALK.length - 1) { walkStep++; renderWalk(); } });
renderWalk();

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

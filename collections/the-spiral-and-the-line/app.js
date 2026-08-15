/* ---------- Toolbox data ---------- */
const TOOLS=[
  {n:"Synonymous",t:"the base pair",d:"The second line says the same thing as the first, in fresh words.",ex:"“The heavens declare the glory of God; the skies proclaim the work of his hands.” — Psalm 19:1"},
  {n:"Antithetic",t:"the base pair",d:"The second line states the opposite, sharpening the first by contrast.",ex:"“The LORD watches over the righteous, but the way of the wicked He frustrates.” — Psalm 1:6"},
  {n:"Synthetic",t:"the base pair",d:"The second line completes or extends the first, building the thought forward.",ex:"“The law of the LORD is perfect, reviving the soul.” — Psalm 19:7"},
  {n:"Chiasmus",t:"A‑B‑B‑A",d:"Ideas mirror inward and back out, so the turning point at the center is the message.",ex:"“The Sabbath was made for man, not man for the Sabbath.” — Mark 2:27"},
  {n:"Staircase",t:"climbing repetition",d:"A word from one line is picked up and lifted higher in the next, like a rising staircase.",ex:"“Ascribe to the LORD… ascribe to the LORD glory and strength.” — Psalm 29:1"},
  {n:"Emblematic",t:"picture + meaning",d:"One line paints a concrete image; the other applies it to a spiritual reality.",ex:"“As the deer pants for streams of water, so my soul pants for you, O God.” — Psalm 42:1"},
  {n:"Alternate",t:"A‑B‑A‑B",d:"Two threads interleave line by line instead of sitting in blocks.",ex:"Thought A, then B, then A again, then B — a woven back‑and‑forth."},
  {n:"Envelope",t:"inclusion / framing",d:"A unit opens and closes with the same phrase, framing everything inside it.",ex:"“Bless the LORD, O my soul” opens and closes all of Psalm 103."},
  {n:"Merism",t:"totality",d:"Two extremes are named to mean the whole thing in between.",ex:"“The heavens and the earth” = the entire universe. “My sitting and my rising” = all that I do."},
  {n:"Echo",t:"allusion",d:"A later writer deliberately reuses an earlier phrase to link the two texts together.",ex:"John reaches back to Daniel and Ezekiel so their weight lands on his words."}
];
(function(){const c=document.getElementById("tools");TOOLS.forEach(o=>{const d=document.createElement("div");d.className="tool";d.onclick=()=>d.classList.toggle("open");d.innerHTML=`<div class="tool-sum"><span class="tool-name">${o.n}</span><span class="tool-tag">${o.t}</span><span class="tool-arr">▾</span></div><div class="tool-det"><div class="tool-in">${o.d}<span class="ex">${o.ex}</span></div></div>`;c.appendChild(d)})})();

/* ---------- Daniel Double Vision ---------- */
const DAN=[
  {emp:"Empire I · Babylon",g2:"👑",lead2:"Head of Gold",desc2:"Bright, precious, the pride of the age.",g7:"🦁",lead7:"Lion with Eagle's Wings",desc7:"Regal but wrenched up, given a human heart.",sc:"Daniel 2:38 · 7:4"},
  {emp:"Empire II · Medo‑Persia",g2:"⚖️",lead2:"Chest &amp; Arms of Silver",desc2:"Two arms — two peoples joined.",g7:"🐻",lead7:"Lopsided Bear, three ribs",desc7:"Raised on one side, hungry for conquest.",sc:"Daniel 2:39 · 7:5"},
  {emp:"Empire III · Greece",g2:"🛡️",lead2:"Belly &amp; Thighs of Bronze",desc2:"The metal of Greek armor and reach.",g7:"🐆",lead7:"Winged Leopard, four heads",desc7:"Blinding speed; split four ways after Alexander.",sc:"Daniel 2:39 · 7:6"},
  {emp:"Empire IV · Rome / Final",g2:"🦵",lead2:"Legs of Iron, feet of clay",desc2:"Crushing strength, fracturing at the base.",g7:"🐉",lead7:"Terrifying Iron‑Toothed Beast",desc7:"Ten horns and a boastful little horn.",sc:"Daniel 2:40 · 7:7"},
  {emp:"The Finish Line",g2:"🪨",lead2:"A Stone cut without hands",desc2:"It smashes the statue and fills the whole earth.",g7:"👑",lead7:"The Son of Man",desc7:"Given an everlasting kingdom; the beasts destroyed.",sc:"Daniel 2:44–45 · 7:13–14",fin:true}
];
let danView="statue";
function buildDan(){const c=document.getElementById("dcards");c.innerHTML="";DAN.forEach((o,i)=>{const card=document.createElement("div");card.className="dcard"+(o.fin?" finish":"")+(danView==="beast"?" flipped":"");card.onclick=()=>card.classList.toggle("flipped");card.innerHTML=`
    <div class="dinner">
      <div class="dface dfront"><span class="emp">${o.emp}</span><span class="glyph">${o.g2}</span><span class="lead">${o.lead2}</span><span class="desc">${o.desc2}</span><span class="sc">${o.sc}</span></div>
      <div class="dface dback"><span class="emp">${o.emp}</span><span class="glyph">${o.g7}</span><span class="lead">${o.lead7}</span><span class="desc">${o.desc7}</span><span class="sc">${o.sc}</span></div>
    </div>`;c.appendChild(card)})}
function setDan(v){danView=v;document.getElementById("danStatueBtn").classList.toggle("on",v==="statue");document.getElementById("danBeastBtn").classList.toggle("on",v==="beast");document.querySelectorAll("#dcards .dcard").forEach(card=>card.classList.toggle("flipped",v==="beast"))}
buildDan();

/* ---------- Timeline Flipper: Parallel table ---------- */
const REV=[
  {t:"The Earth / Land",s:"1st — White Horse: conquest rides out",tr:"1st — hail &amp; fire, a third of the earth burned",b:"1st — sores break out on the earth",note:"All three open by striking the land itself — the ground people stand on."},
  {t:"The Sea",s:"2nd — Red Horse: war takes peace from the earth",tr:"2nd — a third of the sea turns to blood",b:"2nd — the sea turns to blood",note:"The trumpet and bowl name the identical target: the sea. The seal's war is what churns it."},
  {t:"Fresh Water / Rivers",s:"3rd — Black Horse: famine, scales &amp; scarcity",tr:"3rd — Wormwood: rivers turn bitter",b:"3rd — rivers turn to blood",note:"Rivers and springs — the water of life — struck in each cycle."},
  {t:"The Heavens / Sky",s:"4th — Pale Horse: Death over a quarter of the earth",tr:"4th — sun, moon &amp; stars darkened",b:"4th — the sun scorches people with fire",note:"Each turns to the sky and the lights above."},
  {t:"The Spiritual Realm &amp; Woe",s:"5th — martyrs cry out from under the altar",tr:"5th — locusts from the abyss torment mankind",b:"5th — darkness falls on the Beast's throne",note:"A shift from the physical to the spiritual — the cost of faith and the seat of evil."},
  {t:"Prep for the End · Armageddon",s:"6th — the sky recedes; “the great day of wrath has come”",tr:"6th — angels at the Euphrates released",b:"6th — the Euphrates dries for the kings' final march",note:"The sixth of each series stages the final battle. The seal already voices the world crying that the end has arrived (Rev 6:16–17).",fin:true},
  {t:"The Final Judgment",s:"7th — silence, then thunder, lightning &amp; earthquake",tr:"7th — “The kingdom has become the Lord's”; earthquake &amp; hail",b:"7th — “It is done!” — the greatest earthquake ever",note:"THE FINISH LINE. All three close with the same thunder, lightning, and history-ending earthquake (Rev 6:12; 11:19; 16:18). This identical ending is the strongest case for the spiral reading.",fin:true}
];
(function(){const b=document.getElementById("tlBody");REV.forEach((r,i)=>{const tr=document.createElement("tr");tr.className="tl-row"+(r.fin?" fin":"");tr.onclick=()=>{const n=document.getElementById("tln"+i);n.classList.toggle("open")};tr.innerHTML=`<td class="tgt">${r.t}</td><td>${r.s}</td><td>${r.tr}</td><td>${r.b}</td>`;b.appendChild(tr);const nt=document.createElement("tr");nt.className="tl-note";nt.id="tln"+i;nt.innerHTML=`<td colspan="4"><span class="nl">Why they line up</span>${r.note}</td>`;b.appendChild(nt)})})();

function setTL(v){const p=v==="para";document.getElementById("tlParaBtn").classList.toggle("on",p);document.getElementById("tlTeleBtn").classList.toggle("on",!p);document.getElementById("tlPara").classList.toggle("show",p);document.getElementById("tlTele").classList.toggle("show",!p)}

/* ---------- Telescopic nesting ---------- */
function teleToggle(el,id){const n=document.getElementById(id);const open=n.classList.toggle("open");const arr=el.querySelector(".darr");if(arr)arr.style.transform=open?"rotate(180deg)":"none"}
function teleAll(open){["nest1","nest2"].forEach(id=>{document.getElementById(id).classList.toggle("open",open)});document.querySelectorAll("#tlTele .darr").forEach(a=>a.style.transform=open?"rotate(180deg)":"none")}

/* ---------- Nav active-on-scroll ---------- */
const links=[...document.querySelectorAll(".nav a")];
const secs=links.map(a=>document.getElementById(a.dataset.t));
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;links.forEach(a=>a.classList.toggle("active",a.dataset.t===id))}})},{rootMargin:"-45% 0px -50% 0px"});
secs.forEach(s=>s&&io.observe(s));

/* ---------- Share / print ---------- */
function copyLink(){navigator.clipboard.writeText(window.location.href).then(()=>showToast("Link copied to clipboard")).catch(()=>showToast("Couldn't copy — try manually"))}
function shareNative(){if(navigator.share){navigator.share({title:"The Spiral and the Line",text:"Hebrew prophecy doesn't just march — it spirals. An interactive study of recapitulation.",url:window.location.href})}else{copyLink()}}
function showToast(m){const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}

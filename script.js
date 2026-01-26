// script.js
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // Year
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  // ===== Starfield =====
  const canvas = $("#stars");
  const ctx = canvas?.getContext("2d");
  let w=0, h=0, dpr=1, stars=[];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize(){
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+"px";
    canvas.style.height = h+"px";

    const count = Math.floor((w*h)/22000); // density
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: (Math.random()*1.3 + 0.4),
      v: (Math.random()*0.25 + 0.05),
      a: Math.random()*0.6 + 0.25
    }));
  }

  function draw(){
    if (!ctx || prefersReduced) return;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);

    // subtle gradient haze
    const g = ctx.createRadialGradient(w*0.25, h*0.2, 20, w*0.25, h*0.2, Math.max(w,h));
    g.addColorStop(0, "rgba(216,177,90,0.06)");
    g.addColorStop(0.55, "rgba(120,160,255,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for (const s of stars){
      s.y += s.v;
      if (s.y > h+2) { s.y = -2; s.x = Math.random()*w; }

      // twinkle
      const tw = 0.3 + 0.7*Math.abs(Math.sin((s.y + s.x) * 0.002));
      ctx.globalAlpha = s.a * tw;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = "rgba(240,211,139,1)";
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive:true });
  resize();
  draw();

  // ===== Typewriter line =====
  const typeLine = $("#typeLine");
  const phrases = [
    "awakening",
    "origin",
    "portal",
    "seal unbroken",
    "tablet listening"
  ];
  let pi = 0, ci = 0, dir = 1;
  function typeTick(){
    if (!typeLine || prefersReduced) return;
    const p = phrases[pi];
    ci += dir;
    if (ci >= p.length+8) dir = -1;
    if (ci <= 0){
      dir = 1;
      pi = (pi+1) % phrases.length;
    }
    typeLine.textContent = p.slice(0, Math.max(0, Math.min(p.length, ci)));
    setTimeout(typeTick, 80);
  }
  typeTick();

  // ===== Tablet command responses =====
  const cmd = $("#cmd");
  const send = $("#send");
  const log = $("#log");

  function addLog(text){
    if (!log) return;
    const div = document.createElement("div");
    div.className = "logItem";
    div.textContent = text;
    log.prepend(div);
  }

  function respond(qRaw){
    const q = (qRaw || "").trim().toLowerCase();
    if (!q) return;

    if (q.includes("awak")) {
      addLog("AWAKENING: Resonance engaged. Obsidian lattice warming. Awaiting operator intent.");
    } else if (q.includes("origin")) {
      addLog("ORIGIN: Fragment retrieved. 'From dust and starlight, the first seal was pressed.'");
    } else if (q.includes("portal") || q.includes("gate") || q.includes("kur")) {
      addLog("PORTAL: KUR Gate sealed. Provide keyphrase: “EN-UNLOCK” (demo only).");
    } else if (q.includes("en-unlock")) {
      addLog("KEY ACCEPTED: Gate hum rises. Interface ready to route to /signup, /signin, or /guest.");
    } else {
      addLog(`TABLET: Unrecognized glyph-string "${qRaw}". Try: awakening • origin • portal`);
    }
  }

  send?.addEventListener("click", () => {
    respond(cmd.value);
    cmd.value = "";
    cmd.focus();
  });

  cmd?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      respond(cmd.value);
      cmd.value = "";
    }
  });

  // ===== Reveal tiles =====
  const revealCard = $("#revealCard");
  const revealTag = $("#revealTag");
  const revealTitle = $("#revealTitle");
  const revealText = $("#revealText");
  const closeReveal = $("#closeReveal");

  const reveals = {
    awaken: {
      tag: "𒂗 EN • PROTOCOL",
      title: "Awakening Sequence",
      text:
        "A ceremonial boot routine: light the gold circuits, steady the stone, and align the stars. Use this section to introduce your brand, mission, or product."
    },
    origin: {
      tag: "𒀭 DINGIR • ARCHIVE",
      title: "Origin Fragment",
      text:
        "A lore panel for story, about page, timeline, or manifesto. Keep it mysterious: short paragraphs, big typography, and glyph accents."
    },
    portal: {
      tag: "𒆳 KUR • GATE",
      title: "Portal Key",
      text:
        "A conversion panel: sign up, sign in, guest access, or your real CTA. This is where you route users into your app, store, or community."
    }
  };

  $$(".tile").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-reveal");
      const r = reveals[key];
      if (!r) return;
      if (revealTag) revealTag.textContent = r.tag;
      if (revealTitle) revealTitle.textContent = r.title;
      if (revealText) revealText.textContent = r.text;
      if (revealCard) {
        revealCard.hidden = false;
        revealCard.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      }
    });
  });

  closeReveal?.addEventListener("click", () => {
    if (revealCard) revealCard.hidden = true;
  });

  // ===== Portal buttons (demo routing) =====
  function toast(msg){
    addLog(msg);
  }
  $("#btnSignup")?.addEventListener("click", () => toast("ROUTE: /signup (wire this to real page)"));
  $("#btnSignin")?.addEventListener("click", () => toast("ROUTE: /signin (wire this to real page)"));
  $("#btnGuest")?.addEventListener("click", () => toast("ROUTE: /guest (wire this to real session)"));

  // ===== Contact form (demo) =====
  const form = $("#contactForm");
  const formNote = $("#formNote");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const msg = (fd.get("msg") || "").toString().trim();
    if (formNote) formNote.textContent = `TRANSMISSION QUEUED: "${name}" sent a signal. (Hook to backend later.)`;
    addLog(`TRANSMISSION: ${name || "Unknown"} — ${msg.slice(0, 90)}${msg.length>90 ? "…" : ""}`);
    form.reset();
  });

  // ===== Ambient audio toggle (optional) =====
  const hum = $("#hum");
  const muteBtn = $("#muteBtn");
  let playing = false;

  function setAmbient(on){
    playing = on;
    if (!muteBtn) return;
    muteBtn.setAttribute("aria-pressed", on ? "true" : "false");
    muteBtn.textContent = `AMBIENT: ${on ? "ON" : "OFF"}`;
  }

  muteBtn?.addEventListener("click", async () => {
    if (!hum) { setAmbient(false); return; }

    // If you add a real file, uncomment and place hum.mp3 next to your files:
    // if (!hum.src) hum.src = "./hum.mp3";

    try{
      if (!playing){
        await hum.play();
        setAmbient(true);
        addLog("AMBIENT: low-frequency hum engaged.");
      } else {
        hum.pause();
        setAmbient(false);
        addLog("AMBIENT: muted.");
      }
    } catch {
      setAmbient(false);
      addLog("AMBIENT: blocked by browser (add file + interact first).");
    }
  });

})();

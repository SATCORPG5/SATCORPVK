(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  // Clock
  const clock = $("#clock");
  const pad = (n) => String(n).padStart(2,"0");
  function tick(){
    const d = new Date();
    if (clock) clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    requestAnimationFrame(() => setTimeout(tick, 250));
  }
  tick();

  // Modals
  function openModal(id){
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
    const first = $("input", m);
    if (first) setTimeout(() => first.focus(), 0);
  }
  function closeModal(m){
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }

  $$("[data-open]").forEach(b => b.addEventListener("click", () => openModal(b.dataset.open)));
  $$(".modal").forEach(m => m.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeModal(m);
  }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      const open = $(".modal.is-open");
      if (open) closeModal(open);
    }
  });

  // Demo actions
  const status = $("#statusText");
  const pulse = (msg) => { if (status) status.textContent = msg; };

  $("#signinForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    pulse("AUTH OK • ROUTING TO LOBBY… (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1500);
    const m = $("#signin"); if (m) closeModal(m);
  });

  $("#signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    pulse("PROFILE CREATED • ASSIGNING TIER… (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1700);
    const m = $("#signup"); if (m) closeModal(m);
  });

  $("#guest")?.addEventListener("click", (e) => {
    e.preventDefault();
    pulse("GUEST SESSION • READ-ONLY ACCESS (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1600);
  });

  // SATCORP Rain
  const canvas = $("#matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // SATCORP-ish token stream (not movie-like glyphs)
  const TOKENS = [
    "SATCORP", "KYRAX", "PULSΞ", "Ki-Ra", "Ξ", "Δ", "Σ", "Λ", "Ω",
    "NODE", "CHAN", "PORT", "EDGE", "SYNC", "AUTH", "GUEST", "TIER",
    "OPS", "TASK", "QUEUE", "EVENT", "HOOK", "WORKER", "D1", "KV",
    "PING", "ACK", "OK", "WARN", "LOCK", "OPEN", "READY",
    "ID", "UID", "HASH", "JWT", "SIG", "TTL", "CSRF",
    "v0.1", "v0.2", "alpha", "beta"
  ];

  const VERBS = ["ALLOC", "ROUTE", "VERIFY", "EMIT", "PATCH", "MERGE", "BIND", "INDEX", "REPLAY", "THROTTLE"];
  const hex = () => Math.floor(Math.random()*16).toString(16).toUpperCase();
  const rand = (a,b)=>a+Math.random()*(b-a);
  const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];

  function makeAtom(){
    const r = Math.random();
    if (r < 0.30) return pick(TOKENS);
    if (r < 0.52) return `${pick(VERBS)}:${pick(TOKENS)}`;
    if (r < 0.70) return `N-${hex()}${hex()}${hex()}${hex()}`;
    if (r < 0.84) return `${hex()}${hex()}${hex()}${hex()}-${hex()}${hex()}${hex()}${hex()}`;
    if (r < 0.93) return `OP#${Math.floor(rand(100,999))}`;
    return "Ξ";
  }

  // We draw per-column “streams” of atoms (strings), not single glyphs.
  let w=0, h=0, dpr=1;
  let fontSize = 15;
  let cols = 0;
  let streams = [];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);

    fontSize = w < 520 ? 14 : 15;
    cols = Math.floor(w / (fontSize * 0.95));

    streams = new Array(cols).fill(0).map((_, i) => {
      const speed = rand(0.6, 1.4);
      const y = rand(-h, 0);
      const density = rand(0.55, 0.90); // how often tokens appear
      return { x: i * (fontSize * 0.95), y, speed, density };
    });

    ctx.font = `600 ${fontSize}px JetBrains Mono`;
    ctx.textBaseline = "top";
  }
  window.addEventListener("resize", resize, { passive:true });
  resize();

  function frame(){
    // softer trails, more “terminal glass”
    ctx.fillStyle = "rgba(2,6,4,0.10)";
    ctx.fillRect(0,0,w,h);

    for (const s of streams){
      // advance stream
      s.y += s.speed * fontSize;

      // token probability
      if (Math.random() < s.density){
        const atom = makeAtom();

        // head glow (brighter)
        ctx.fillStyle = "rgba(125,255,178,0.92)";
        ctx.fillText(atom, s.x, s.y);

        // faint tail echo behind it
        ctx.fillStyle = "rgba(25,255,106,0.28)";
        ctx.fillText(atom, s.x, s.y - fontSize * 1.2);
      }

      // occasionally “burst” extra atoms
      if (Math.random() > 0.992){
        const burst = `${pick(VERBS)}:${pick(TOKENS)}:${hex()}${hex()}`;
        ctx.fillStyle = "rgba(25,255,106,0.50)";
        ctx.fillText(burst, s.x, s.y + fontSize);
      }

      // reset
      if (s.y > h + 120){
        s.y = rand(-h, -120);
        s.speed = rand(0.6, 1.4);
        s.density = rand(0.55, 0.90);
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

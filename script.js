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
    pulse("AUTH OK • ROUTING… (demo)");
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
    pulse("GUEST SESSION • LIMITED ACCESS (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1600);
  });

  // Matrix Rain
  const canvas = $("#matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let w=0, h=0, dpr=1, cols=0;
  let fontSize = 16;
  let drops = [];
  const glyphs = "アカサタナハマヤラワ0123456789$#%&*+-<>|:_=SATCORPΞ";
  const pick = () => glyphs[Math.floor(Math.random()*glyphs.length)];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);

    fontSize = w < 520 ? 14 : 16;
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.floor(Math.random()*h/fontSize));
    ctx.font = `600 ${fontSize}px JetBrains Mono`;
  }
  window.addEventListener("resize", resize, { passive:true });
  resize();

  function frame(){
    // fade trails
    ctx.fillStyle = "rgba(2,6,4,0.08)";
    ctx.fillRect(0,0,w,h);

    // draw glyphs
    for (let i=0; i<cols; i++){
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // brighter head
      ctx.fillStyle = "rgba(125,255,178,0.95)";
      ctx.fillText(pick(), x, y);

      // dim tail glyph (slight offset)
      ctx.fillStyle = "rgba(25,255,106,0.55)";
      ctx.fillText(pick(), x, y - fontSize);

      // advance
      drops[i] += Math.random() > 0.92 ? 2 : 1;

      // reset
      if (y > h && Math.random() > 0.975){
        drops[i] = 0;
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

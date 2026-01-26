(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Modal logic
  function openModal(id){
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus first input
    const first = $("input", m);
    if (first) setTimeout(() => first.focus(), 0);
  }
  function closeModal(m){
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $$("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.open));
  });

  $$(".modal").forEach(m => {
    m.addEventListener("click", (e) => {
      const t = e.target;
      if (t.matches("[data-close]")) closeModal(m);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = $(".modal.is-open");
    if (open) closeModal(open);
  });

  // Demo submissions (no backend)
  const status = $("#statusText");
  const pulse = (msg) => { if (status) status.textContent = msg; };

  $("#signinForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    pulse("AUTH OK • ROUTING… (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1400);
    const m = $("#signin");
    if (m) closeModal(m);
  });

  $("#signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    pulse("PROFILE CREATED • ASSIGNING TIER… (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1600);
    const m = $("#signup");
    if (m) closeModal(m);
  });

  $("#guest")?.addEventListener("click", (e) => {
    e.preventDefault();
    pulse("GUEST SESSION • LIMITED ACCESS (demo)");
    setTimeout(() => pulse("SYSTEM ONLINE • READY"), 1600);
    // later: window.location.href = "/app";
  });

  // Ambient FX (soft particles + scan drift)
  const canvas = document.getElementById("fx");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let w=0,h=0,dpr=1;
  const pts = [];
  const rand = (a,b)=>a+Math.random()*(b-a);

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);

    pts.length = 0;
    const n = Math.floor(Math.min(120, Math.max(70, (w*h)/18000)));
    for(let i=0;i<n;i++){
      pts.push({
        x: rand(0,w), y: rand(0,h),
        r: rand(0.8, 2.2),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.10, 0.10),
        a: rand(0.05, 0.12)
      });
    }
  }
  window.addEventListener("resize", resize, { passive:true });
  resize();

  let t=0;
  function draw(){
    t += 0.01;
    ctx.clearRect(0,0,w,h);

    // scanline drift
    ctx.globalAlpha = 0.07;
    const y = (Math.sin(t*0.9)*0.5+0.5)*h;
    const grd = ctx.createLinearGradient(0, y-140, 0, y+140);
    grd.addColorStop(0, "rgba(138,92,255,0)");
    grd.addColorStop(0.5, "rgba(138,92,255,0.35)");
    grd.addColorStop(1, "rgba(138,92,255,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, y-140, w, 280);

    // particles
    ctx.globalAlpha = 1;
    for(const p of pts){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = w+20;
      if (p.x > w+20) p.x = -20;
      if (p.y < -20) p.y = h+20;
      if (p.y > h+20) p.y = -20;

      ctx.beginPath();
      ctx.fillStyle = `rgba(177,139,255,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

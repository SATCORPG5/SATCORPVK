// script.js — ULTRA-REALISTIC CRT MATRIX (rain + console + flicker + rolling band)
(() => {
  const $ = (id) => document.getElementById(id);

  // Footer year
  $("year").textContent = new Date().getFullYear();

  // Clock
  const clockEl = $("clock");
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const d = new Date();
    clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);

  // Fake latency
  const latencyEl = $("latency");
  setInterval(() => {
    const ms = Math.floor(14 + Math.random() * 58);
    latencyEl.textContent = `${ms}ms`;
  }, 850);

  // Terminal log
  const log = $("log");
  const write = (html) => {
    const p = document.createElement("p");
    p.className = "line";
    p.innerHTML = html;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  };

  const boot = () => {
    write(`<span class="k">[boot]</span> Calibrating phosphor glow… <span class="ok">OK</span>`);
    write(`<span class="k">[crt]</span> Shadow-mask alignment… <span class="ok">OK</span>`);
    write(`<span class="k">[net]</span> Establishing tunnel… <span class="ok">OK</span>`);
    write(`<span class="k">[env]</span> Noise profile locked… <span class="ok">OK</span>`);
    write(`<span class="k">[hint]</span> Type <span class="ok">help</span> for commands.`);
  };
  boot();

  const cmdForm = $("cmdForm");
  const cmdInput = $("cmdInput");

  const commands = {
    help() {
      write(`<span class="prompt">help</span> → commands: <span class="ok">status</span>, <span class="ok">jack-in</span>, <span class="ok">clear</span>, <span class="ok">whoami</span>, <span class="ok">trace</span>`);
    },
    status() {
      write(`<span class="prompt">status</span> → system: <span class="ok">online</span> | node: <span class="ok">stable</span> | threat: <span class="warn">medium</span>`);
    },
    "jack-in"() {
      write(`<span class="prompt">jack-in</span> → initiating neural link… <span class="ok">SYNC</span>`);
      write(`<span class="k">[matrix]</span> signal acquired. welcome, operator.`);
    },
    whoami() {
      write(`<span class="prompt">whoami</span> → <span class="ok">operator</span> (guest permissions)`);
    },
    trace() {
      write(`<span class="prompt">trace</span> → tracing sentinel path… <span class="warn">blocked</span>`);
      write(`<span class="k">[advice]</span> use <span class="ok">sign in</span> for elevated access.`);
    },
    clear() {
      log.innerHTML = "";
      write(`<span class="k">[console]</span> cleared.`);
    }
  };

  cmdForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = (cmdInput.value || "").trim();
    if (!raw) return;

    const key = raw.toLowerCase();
    write(`<span class="prompt">> ${raw}</span>`);

    if (key === "sign in" || key === "signin") {
      write(`<span class="k">[route]</span> → /#signin (demo)`);
      location.hash = "signin";
    } else if (key === "sign up" || key === "signup") {
      write(`<span class="k">[route]</span> → /#signup (demo)`);
      location.hash = "signup";
    } else if (key === "guest" || key === "join as guest") {
      write(`<span class="k">[route]</span> → /#guest (demo)`);
      location.hash = "guest";
    } else if (commands[key]) {
      commands[key]();
    } else {
      write(`<span class="k">[err]</span> unknown command: <span class="err">${raw}</span>`);
      write(`<span class="k">[hint]</span> try <span class="ok">help</span>`);
    }

    cmdInput.value = "";
    cmdInput.focus();
  });

  setTimeout(() => cmdInput.focus(), 350);
  document.addEventListener("click", (e) => {
    if (e.target.closest(".terminal")) cmdInput.focus();
  });

  // Respect reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // ===== Micro camera sway + CRT flicker + rolling band =====
  let mx = 0, my = 0, tx = 0, ty = 0;

  window.addEventListener("pointermove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    tx = (e.clientX - cx) / cx;
    ty = (e.clientY - cy) / cy;
  }, { passive:true });

  let roll = 0;
  function sway(){
    mx += (tx - mx) * 0.045;
    my += (ty - my) * 0.045;

    const rx = (-my * 0.55);
    const ry = (mx * 0.75);

    document.documentElement.style.setProperty("--warpX", `${rx.toFixed(3)}deg`);
    document.documentElement.style.setProperty("--warpY", `${ry.toFixed(3)}deg`);

    const base = 0.992 + Math.random() * 0.016;
    const spike = (Math.random() < 0.03) ? (0.97 + Math.random()*0.06) : 1;
    document.documentElement.style.setProperty("--flicker", (base * spike).toFixed(3));

    roll += 0.45 + Math.random() * 0.15;
    const y = ((roll % (window.innerHeight * 1.2)) - window.innerHeight * 0.2);
    document.documentElement.style.setProperty("--rollY", `${y.toFixed(1)}px`);

    requestAnimationFrame(sway);
  }
  requestAnimationFrame(sway);

  // ===== Ultra-real Matrix rain (multi-layer depth) =====
  const canvas = $("rain");
  const ctx = canvas.getContext("2d", { alpha: true });

  const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ0123456789#$%*+-<>/\\|";
  const pick = () => glyphs[(Math.random() * glyphs.length) | 0];

  let w = 0, h = 0, dpr = 1, fontSize = 16, cols = 0;

  let near = [];
  let far = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = Math.max(14, Math.floor(w / 86));
    ctx.font = `600 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
    cols = Math.floor(w / fontSize);

    near = new Array(cols).fill(0).map(() => ({
      y: Math.random() * -80,
      v: 0.95 + Math.random() * 0.55,
      tail: 10 + (Math.random() * 14 | 0)
    }));
    far = new Array(cols).fill(0).map(() => ({
      y: Math.random() * -110,
      v: 0.55 + Math.random() * 0.35,
      tail: 8 + (Math.random() * 10 | 0)
    }));
  }
  window.addEventListener("resize", resize, { passive:true });
  resize();

  let last = performance.now();

  function drawLayer(layer, alphaBase, blurAmount){
    ctx.save();
    ctx.filter = blurAmount ? `blur(${blurAmount}px)` : "none";
    ctx.font = `600 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;

    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;
      const d = layer[i];

      const y = d.y * fontSize;
      const headCh = pick();

      // tail
      for (let t = 0; t < d.tail; t++) {
        const ch = pick();
        const yy = y - t * fontSize;
        const a = Math.max(0, alphaBase * (1 - t / d.tail));
        if (yy < -fontSize) continue;
        if (yy > h + fontSize) break;
        ctx.fillStyle = `rgba(57, 255, 122, ${a})`;
        ctx.fillText(ch, x, yy);
      }

      // bright head
      ctx.fillStyle = `rgba(210, 255, 235, ${Math.min(0.9, alphaBase + 0.35)})`;
      ctx.fillText(headCh, x, y);

      d.y += d.v;

      if (y > h + (d.tail * fontSize) && Math.random() > 0.975) {
        d.y = Math.random() * -60;
        d.v = (layer === near) ? (0.95 + Math.random() * 0.6) : (0.55 + Math.random() * 0.4);
        d.tail = (layer === near) ? (10 + (Math.random() * 16 | 0)) : (8 + (Math.random() * 12 | 0));
      }
    }

    ctx.restore();
  }

  function frame(now){
    const dt = Math.min(40, now - last);
    last = now;

    // CRT-ish persistence fade
    ctx.fillStyle = "rgba(0, 0, 0, 0.075)";
    ctx.fillRect(0, 0, w, h);

    const pulse = 0.06 * Math.sin(now / 900);

    // Far (soft/dim)
    drawLayer(far, 0.20 + pulse, 0.6);

    // Near (sharp/brighter)
    drawLayer(near, 0.32 + pulse, 0.0);

    // keep speed consistent across refresh rates
    const k = dt / 16.7;
    for (let i = 0; i < cols; i++){
      near[i].y += 0.45 * (k - 1);
      far[i].y += 0.25 * (k - 1);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

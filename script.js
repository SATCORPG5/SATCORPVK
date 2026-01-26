// script.js
(() => {
  const $ = (id) => document.getElementById(id);

  // Footer year
  $("year").textContent = new Date().getFullYear();

  // Clock
  const clockEl = $("clock");
  const tick = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);

  // Fake latency
  const latencyEl = $("latency");
  setInterval(() => {
    const ms = Math.floor(18 + Math.random() * 44);
    latencyEl.textContent = `${ms}ms`;
  }, 900);

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
    write(`<span class="k">[boot]</span> Loading operator shell… <span class="ok">OK</span>`);
    write(`<span class="k">[auth]</span> Cipher handshake… <span class="ok">OK</span>`);
    write(`<span class="k">[net]</span> Routing via dark node… <span class="ok">OK</span>`);
    write(`<span class="k">[env]</span> CRT overlays… <span class="ok">OK</span>`);
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

  // Focus input on load + click anywhere inside terminal
  setTimeout(() => cmdInput.focus(), 350);
  document.addEventListener("click", (e) => {
    if (e.target.closest(".terminal")) cmdInput.focus();
  });

  // Matrix rain
  const canvas = $("rain");
  const ctx = canvas.getContext("2d", { alpha: true });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let w = 0, h = 0, dpr = 1;
  let cols = 0;
  let drops = [];
  const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ0123456789#$%*+-<>/\\|";

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = Math.max(14, Math.floor(w / 80));
    ctx.font = `600 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -60);
    resize.fontSize = fontSize;
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  let last = 0;
  function frame(t) {
    const dt = t - last;
    last = t;

    // Fade
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, w, h);

    // Characters
    const fs = resize.fontSize || 16;
    for (let i = 0; i < cols; i++) {
      const x = i * fs;
      const y = drops[i] * fs;

      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      // green
      ctx.fillStyle = "rgba(53, 255, 116, 0.85)";
      ctx.fillText(ch, x, y);

      // occasional brighter head
      if (Math.random() < 0.03) {
        ctx.fillStyle = "rgba(200, 255, 225, 0.95)";
        ctx.fillText(ch, x, y);
      }

      drops[i] += (dt / 16.7) * (0.85 + Math.random() * 0.35);

      if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -40;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

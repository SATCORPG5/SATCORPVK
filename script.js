const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

const CHANNELS = {
  start: {
    title: "start-here",
    subtitle: "What SATCORP is and how to work with us.",
    messages: [
      {
        who: "SATCORP",
        role: "Ops",
        time: "pinned",
        avatar: "S",
        text: `
          <b>Welcome to SATCORP.</b> We build clean systems that remove friction and increase revenue.
          <div class="block">
            <h3>How this server works</h3>
            <ul>
              <li>Browse channels on the left like a real Discord.</li>
              <li>Use <span class="kbd">Request a Quote</span> to start.</li>
              <li>If you’re local, we can also set you up with a simple call-first site.</li>
            </ul>
          </div>
        `
      },
      {
        who: "ANU",
        role: "Concierge",
        time: "now",
        avatar: "A",
        text: `
          I operate as a concierge, not a vendor.
          Tell me what you want to build, I’ll map the cleanest path and ship the assets organized.
          <div class="block">
            <h3>Fast intake</h3>
            <ul>
              <li>What is the business + what do you sell?</li>
              <li>What does “success” look like in 30 days?</li>
              <li>Do you need calls, quotes, bookings, or purchases?</li>
            </ul>
          </div>
        `
      }
    ]
  },

  services: {
    title: "services",
    subtitle: "What SATCORP can build (and how it’s packaged).",
    messages: [
      {
        who: "SATCORP",
        role: "Ops",
        time: "pinned",
        avatar: "S",
        text: `
          <div class="block">
            <h3>Core services</h3>
            <ul>
              <li><b>Websites</b> — one-page launchers → full multi-page builds</li>
              <li><b>Brand systems</b> — logo, type, color, voice, usage rules</li>
              <li><b>Automation</b> — forms, webhooks, bots, workflows</li>
              <li><b>Content systems</b> — overlays, templates, post kits</li>
            </ul>
          </div>
          <div class="block">
            <h3>Delivery standard</h3>
            <ul>
              <li>Mobile-first design</li>
              <li>Fast load + clean UI</li>
              <li>Organized handoff folder</li>
            </ul>
          </div>
        `
      }
    ]
  },

  proof: {
    title: "proof",
    subtitle: "Mini case studies + before/after examples (drop yours in).",
    messages: [
      {
        who: "KYRAX",
        role: "Systems",
        time: "recent",
        avatar: "K",
        text: `
          Post work previews here: screenshots, links, or short clips.
          <div class="block">
            <h3>Proof blocks to add</h3>
            <ul>
              <li>Before → After (1 image each)</li>
              <li>Problem → Fix → Result</li>
              <li>2–3 bullets per project</li>
            </ul>
          </div>
        `
      }
    ]
  },

  web: {
    title: "websites",
    subtitle: "Landing pages, local business sites, and conversion upgrades.",
    messages: [
      {
        who: "SATCORP",
        role: "Ops",
        time: "today",
        avatar: "S",
        text: `
          <div class="block">
            <h3>Website packages (simple)</h3>
            <ul>
              <li><b>Launch</b> — one page: hero, services, gallery, contact</li>
              <li><b>Pro</b> — multi-page + SEO + forms</li>
              <li><b>Upgrade</b> — redesign, speed, conversion fixes</li>
            </ul>
          </div>
        `
      }
    ]
  },

  brand: {
    title: "brand-systems",
    subtitle: "Identity, voice, and a usable rulebook.",
    messages: [
      {
        who: "SATCORP",
        role: "Ops",
        time: "today",
        avatar: "S",
        text: `
          <div class="block">
            <h3>Brand system deliverables</h3>
            <ul>
              <li>Logo / wordmark options</li>
              <li>Color + type system</li>
              <li>Voice + messaging</li>
              <li>Usage guidelines + templates</li>
            </ul>
          </div>
        `
      }
    ]
  },

  automation: {
    title: "automation",
    subtitle: "Webhooks, bots, workflows, and operational speed.",
    messages: [
      {
        who: "KYRAX",
        role: "Systems",
        time: "today",
        avatar: "K",
        text: `
          <div class="block">
            <h3>Automation examples</h3>
            <ul>
              <li>Quote form → auto email + CRM row</li>
              <li>Discord alerts for new leads</li>
              <li>Scheduling + follow-up reminders</li>
              <li>Content publish → auto post fanout</li>
            </ul>
          </div>
        `
      }
    ]
  },

  content: {
    title: "content-systems",
    subtitle: "Overlays, templates, and repeatable output.",
    messages: [
      {
        who: "PULSΞ",
        role: "Broadcast",
        time: "today",
        avatar: "P",
        text: `
          <div class="block">
            <h3>Content system</h3>
            <ul>
              <li>Stream overlays + scenes kit</li>
              <li>Post templates (reels, stories, banners)</li>
              <li>Brand-aligned asset library</li>
            </ul>
          </div>
        `
      }
    ]
  },

  quote: {
    title: "request-a-quote",
    subtitle: "Fill the form on the right — or use these intake prompts.",
    messages: [
      {
        who: "ANU",
        role: "Concierge",
        time: "pinned",
        avatar: "A",
        text: `
          <div class="block">
            <h3>Fast quote prompts</h3>
            <ul>
              <li>What do you sell and who buys it?</li>
              <li>What do you want the site/system to do? (calls, bookings, quotes)</li>
              <li>Do you have photos, logo, brand colors, and a domain?</li>
              <li>Deadline + budget range?</li>
            </ul>
          </div>
          Use the form on the right to kick this off.
        `
      }
    ]
  },

  faq: {
    title: "faq",
    subtitle: "Common questions (timelines, pricing structure, process).",
    messages: [
      {
        who: "SATCORP",
        role: "Ops",
        time: "today",
        avatar: "S",
        text: `
          <div class="block">
            <h3>FAQ</h3>
            <ul>
              <li><b>How fast?</b> One-page sites can ship fast once content is ready.</li>
              <li><b>What do you need?</b> Logo (if any), services list, photos, hours, contact.</li>
              <li><b>Do you host it?</b> We can deploy to simple hosting (GitHub/Cloudflare) and hand it off.</li>
            </ul>
          </div>
        `
      }
    ]
  }
};

function setActiveChannel(key){
  $$(".ch").forEach(b => b.classList.toggle("ch--active", b.dataset.channel === key));
  const c = CHANNELS[key];
  $("#channelTitle").textContent = c.title;
  $("#channelSubtitle").textContent = c.subtitle;
  $("#composerInput").placeholder = `Message #${c.title}`;
  renderFeed(c.messages);
  // anchor right sidebar form if quote channel
  if(key === "quote") location.hash = "#quote";
}

function renderFeed(messages){
  const feed = $("#feed");
  feed.innerHTML = messages.map(m => `
    <article class="msg">
      <div class="avatar">${m.avatar}</div>
      <div class="meta">
        <div class="meta__top">
          <div class="name">${m.who}</div>
          <span class="badge">${m.role}</span>
          <div class="time">${m.time}</div>
        </div>
        <div class="text">${m.text}</div>
      </div>
    </article>
  `).join("");
  feed.scrollTop = 0;
}

function toast(text){
  const t = document.createElement("div");
  t.textContent = text;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "18px";
  t.style.transform = "translateX(-50%)";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "12px";
  t.style.border = "1px solid var(--line)";
  t.style.background = "rgba(0,0,0,.55)";
  t.style.backdropFilter = "blur(10px)";
  t.style.color = "var(--text)";
  t.style.zIndex = "9999";
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1600);
}

// events
$$(".ch").forEach(btn => btn.addEventListener("click", () => setActiveChannel(btn.dataset.channel)));

$("#search").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  $$(".ch").forEach(b => {
    const txt = b.textContent.toLowerCase();
    b.style.display = txt.includes(q) ? "" : "none";
  });
});

$("#sendBtn").addEventListener("click", () => {
  const v = $("#composerInput").value.trim();
  if(!v) return;
  // In this demo, "sending" just filters to matching channel names/keywords.
  $("#search").value = v;
  $("#search").dispatchEvent(new Event("input"));
  toast("Filtered channels (demo).");
  $("#composerInput").value = "";
});

$("#composerInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#sendBtn").click();
});

$("#copyLink").addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(location.href);
    toast("Invite copied.");
  }catch{
    toast("Copy failed (permissions).");
  }
});

$("#themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "" : "light";
  if(next) root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  toast(next ? "Light mode" : "Dark mode");
});

$("#quoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  toast("Request captured (demo). Hook to email/CRM next.");
  e.target.reset();
});

// init
setActiveChannel("start");

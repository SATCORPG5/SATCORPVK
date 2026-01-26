const $ = (s, el=document) => el.querySelector(s);

const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalSubmit = $("#modalSubmit");

const fieldName = $("#fieldName");
const fieldEmail = $("#fieldEmail");
const fieldPass = $("#fieldPass");
const fieldNote = $("#fieldNote");

let mode = "guest"; // signup | signin | guest

function openModal(nextMode){
  mode = nextMode;

  // Show/hide fields by mode
  // signup: name + email + password + note
  // signin: email + password
  // guest: name + note (optional)
  fieldName.style.display = (mode === "signup" || mode === "guest") ? "" : "none";
  fieldEmail.style.display = (mode === "signup" || mode === "signin") ? "" : "none";
  fieldPass.style.display = (mode === "signup" || mode === "signin") ? "" : "none";
  fieldNote.style.display = (mode === "signup" || mode === "guest") ? "" : "none";

  modalTitle.textContent =
    mode === "signup" ? "Sign up"
    : mode === "signin" ? "Sign in"
    : "Join as guest";

  modalSubmit.textContent =
    mode === "signup" ? "Create account"
    : mode === "signin" ? "Sign in"
    : "Continue as guest";

  modal.setAttribute("aria-hidden", "false");

  // focus first visible input
  setTimeout(() => {
    const first =
      mode === "signin" ? $("#fieldEmail input")
      : mode === "signup" ? $("#fieldName input")
      : $("#fieldName input");
    first?.focus();
  }, 50);
}

function closeModal(){
  modal.setAttribute("aria-hidden", "true");
  $("#modalForm").reset();
}

$("#btnSignup").addEventListener("click", () => openModal("signup"));
$("#btnSignin").addEventListener("click", () => openModal("signin"));
$("#btnGuest").addEventListener("click", () => openModal("guest"));

modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

// Demo submit: route to next page (placeholder)
$("#modalForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Here’s where we’d actually call auth + store user/session.
  // For now, we stash a tiny session and "continue".
  const data = Object.fromEntries(new FormData(e.target).entries());
  const session = {
    mode,
    name: data.name || (mode === "guest" ? "Guest" : ""),
    email: data.email || "",
    note: data.note || "",
    at: new Date().toISOString()
  };
  localStorage.setItem("satcorp_session", JSON.stringify(session));

  // Redirect stub (you can replace this with /app.html later)
  window.location.href = "lobby.html";
});

// clock
function tick(){
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  $("#clock").textContent = `${hh}:${mm}`;
}
tick();
setInterval(tick, 10000);

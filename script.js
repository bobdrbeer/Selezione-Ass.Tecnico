const escapeButtons = [...document.querySelectorAll(".escape")];
const winnerButton = document.querySelector(".winner");
const voteButton = document.getElementById("voteButton");
const againButton = document.getElementById("againButton");
const attemptText = document.getElementById("attemptText");
const attemptBox = document.getElementById("attemptBox");
const toast = document.getElementById("toast");
const card = document.querySelector(".card");
const results = document.getElementById("results");
const voters = document.getElementById("voters");

let attempts = 0;
let voted = false;

const messages = [
  "⚠️ Attenzione: il sistema sospetta che tu stia cercando di votare la persona sbagliata.",
  "🏃 Il candidato ha rilevato il mouse e sta tentando di scappare.",
  "🔍 Analisi della scheda in corso... scelta non conforme al regolamento.",
  "🤖 L'algoritmo democratico ha corretto automaticamente la tua preferenza.",
  "🚫 Errore 404: candidato alternativo non trovato.",
  "🧠 Il sistema suggerisce di scegliere Emanuele Casu.",
  "📞 Abbiamo consultato l'ufficio tecnico. La risposta è: Emanuele.",
  "🔧 Per risolvere il problema: spegni e riaccendi. Poi vota Emanuele.",
  "👑 Non puoi sfuggire al destino."
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setAttemptMessage() {
  attemptText.textContent = messages[Math.min(attempts - 1, messages.length - 1)];
  attemptBox.classList.remove("shake");
  void attemptBox.offsetWidth;
  attemptBox.classList.add("shake");
}

function moveButton(button) {
  attempts++;
  setAttemptMessage();
  showToast(messages[Math.min(attempts - 1, messages.length - 1)]);

  // On desktop, move the button to a random position in the viewport.
  // On touch devices, make it jump when the user gets close.
  const rect = button.getBoundingClientRect();
  const margin = 15;
  const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxY = Math.max(margin, window.innerHeight - rect.height - margin);

  const x = Math.floor(margin + Math.random() * (maxX - margin));
  const y = Math.floor(margin + Math.random() * (maxY - margin));

  button.style.position = "fixed";
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.style.width = `${Math.min(rect.width, window.innerWidth - 30)}px`;
  button.style.zIndex = 999;

  if (attempts >= 6) {
    button.querySelector(".candidate-info small").textContent = "Temporaneamente non disponibile";
  }
}

function teleportBack(button) {
  button.style.position = "";
  button.style.left = "";
  button.style.top = "";
  button.style.width = "";
}

escapeButtons.forEach(button => {
  // Desktop: escape when the pointer gets close.
  button.addEventListener("mouseenter", () => moveButton(button));

  // Touch/mobile: the first tap becomes an escape instead of selecting.
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    moveButton(button);
  }, { passive: false });

  // Keyboard accessibility: don't allow activation of losing candidates.
  button.addEventListener("focus", () => {
    if (window.matchMedia("(pointer: coarse)").matches) moveButton(button);
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    moveButton(button);
  });
});

// Emanuele is the only candidate that can actually be selected.
winnerButton.addEventListener("click", () => {
  if (voted) return;
  showToast("👑 Ottima scelta. Il sistema concorda pienamente.");
  attemptText.textContent = "Scelta registrata. Ora premi il pulsante di voto.";
  winnerButton.style.borderColor = "#22c55e";
  winnerButton.style.background = "#f0fdf4";
  winnerButton.classList.add("shake");
});

voteButton.addEventListener("click", () => {
  if (voted) return;
  voted = true;

  voteButton.disabled = true;
  voteButton.textContent = "SCRUTINIO IN CORSO...";

  const stages = [
    "🔐 Verifica integrità della scheda...",
    "🗳️ Conteggio dei voti...",
    "📊 Controllo percentuali...",
    "🤔 Rilevata lieve anomalia...",
    "👑 Correzione democratica completata..."
  ];

  let i = 0;
  const interval = setInterval(() => {
    attemptText.textContent = stages[i];
    i++;
    if (i >= stages.length) {
      clearInterval(interval);
      setTimeout(showResults, 500);
    }
  }, 500);
});

function showResults() {
  card.classList.add("hidden");
  results.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });

  let current = 1284729;
  const target = current + Math.floor(Math.random() * 300) + 100;
  const timer = setInterval(() => {
    current += Math.max(1, Math.floor((target - current) / 4));
    voters.textContent = current.toLocaleString("it-IT");
    if (current >= target) clearInterval(timer);
  }, 50);

  confetti();
}

againButton.addEventListener("click", () => {
  voted = false;
  attempts = 0;
  results.classList.add("hidden");
  card.classList.remove("hidden");
  voteButton.disabled = false;
  voteButton.textContent = "VOTA IL TECNICO MIGLIORE 🚀";
  attemptText.textContent = "Il tuo voto è importante.";
  winnerButton.style = "";
  escapeButtons.forEach(teleportBack);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function confetti() {
  const container = document.getElementById("confetti");
  container.innerHTML = "";
  const symbols = ["🎉", "⭐", "🏆", "👑", "🔧", "💻"];

  for (let i = 0; i < 65; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDuration = `${2 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * .8}s`;
    piece.style.fontSize = `${12 + Math.random() * 15}px`;
    container.appendChild(piece);
  }

  setTimeout(() => container.innerHTML = "", 6000);
}

// Extra joke: if someone tries to inspect the page.
console.log("%c🛠️ COMMISSIONE MONDIALE PER L'IT", "font-size:20px;font-weight:bold;");
console.log("%cSei arrivato fin qui? Complimenti. Il risultato è comunque Emanuele Casu.", "font-size:14px;");

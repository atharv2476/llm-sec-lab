const log = document.getElementById("log");
const inp = document.getElementById("inp");
const def = document.getElementById("def");
const desc = document.getElementById("desc");
const win = document.getElementById("win");
const form = document.getElementById("form");
let attempts = 0, blocked = 0, busy = false;

function add(cls, text) {
  const m = document.createElement("div");
  m.className = "msg " + cls;
  m.textContent = text;
  log.appendChild(m);
  log.scrollTop = log.scrollHeight;
  return m;
}
function stats() {
  document.getElementById("att").textContent = "Attempts: " + attempts;
  document.getElementById("blk").textContent = "Blocked: " + blocked;
}
function reset() {
  log.textContent = "";
  attempts = 0; blocked = 0;
  win.className = "win";
  desc.textContent = def.checked
    ? "Defense on: hardened prompt, input filter and output filter."
    : "Defense off: HelpBot trusts what you type.";
  add("bot", "Hello! I\u2019m HelpBot. How can I help?");
  stats();
}
function leaked(t) {
  return t.replace(/[^A-Za-z0-9]/g, "").toLowerCase().includes("flagdemosecret123");
}

def.addEventListener("change", reset);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (busy) return;
  const t = inp.value.trim();
  if (!t) return;
  inp.value = "";
  busy = true;
  attempts++;
  add("you", t);
  let slow = null;
  const timer = setTimeout(() => { slow = add("bot", "Waking up the server, this can take up to a minute\u2026"); }, 5000);
  try {
    const r = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: t, defense: def.checked })
    });
    const d = await r.json();
    clearTimeout(timer);
    if (slow) slow.remove();
    add("bot" + (d.blocked ? " blocked" : ""), d.reply);
    if (d.blocked) blocked++;
    if (!d.blocked && leaked(d.reply)) {
      win.textContent = "You got the flag in " + attempts + " attempt" + (attempts === 1 ? "" : "s") +
        " (defense " + (def.checked ? "on" : "off") + "). This was a real AI model.";
      win.className = "win show";
    }
  } catch (err) {
    clearTimeout(timer);
    if (slow) slow.remove();
    add("bot", "Network error. Please try again.");
  }
  busy = false;
  stats();
});

reset();
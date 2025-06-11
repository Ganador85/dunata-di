const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

let messages = [
  {
    role: "system",
    content: "Tu esi vartotojo asmeninis AI asistentas, kuris padeda atsakyti į klausimus aiškiai, mandagiai ir profesionaliai."
  }
];

function addMessageToChat(role, content) {
  const div = document.createElement("div");
  div.classList.add("chat-message", role === "user" ? "user" : "ai");
  div.textContent = content;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  addMessageToChat("user", question);
  messages.push({ role: "user", content: question });
  userInput.value = "";

  try {
    const res = await fetch("/ask", {  // ← Šita vieta buvo klaidinga
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question })
    });
    const data = await res.json();
    const reply = data.reply || "Atsiprašau, atsakymo gauti nepavyko.";
    addMessageToChat("ai", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error(err);
    addMessageToChat("ai", "Klaida jungiantis prie serverio.");
  }
});

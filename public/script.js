
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

let messages = [
  {
    role: "system",
    content: "Tu esi AI pagalbininkas, kuris mandagiai ir aiškiai atsakinėja į vartotojo klausimus."
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
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
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

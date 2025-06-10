const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);

function appendMessage(sender, text) {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("labas", message);
  userInput.value = "";

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    appendMessage("AI", data.reply);
  } catch (error) {
    appendMessage("AI", "Klaida jungiantis prie serverio.");
  }
}

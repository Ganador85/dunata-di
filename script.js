const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', async () => {
  const userMessage = input.value;
  if (!userMessage.trim()) return;

  // Atvaizduoti vartotojo žinutę
  chatBox.innerHTML += `<p><strong>Jūs:</strong> ${userMessage}</p>`;
  input.value = '';

  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    chatBox.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
  } catch (error) {
    console.error(error);
    chatBox.innerHTML += `<p style="color:red;"><strong>Klaida jungiantis prie serverio.</strong></p>`;
  }
});

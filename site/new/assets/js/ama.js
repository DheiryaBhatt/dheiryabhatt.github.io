// ── AMA Chat Widget ──
const amaInput = document.getElementById('amaInput');
const amaSend  = document.getElementById('amaSend');
const amaChat  = document.getElementById('amaChat');

const responses = [
  "That's a great question. In my experience, the answer often emerges from iterating on the problem rather than solving it head-on.",
  "I think about this a lot. The key insight is that complexity hides in the interfaces between systems, not inside them.",
  "Honestly? Start with the simplest thing that could possibly work, then let reality tell you where the edges are.",
  "The best mental model I've found: treat every assumption as a hypothesis to be falsified, not a fact to be built upon.",
  "Short answer: it depends. Long answer: it depends on constraints you haven't fully enumerated yet.",
  "This is where most engineers go wrong — they optimize before they understand. Understand first. Always.",
];

function addMessage(text, isUser) {
  const wrap = document.createElement('div');
  if (isUser) {
    wrap.className = 'chat-q';
    wrap.textContent = `"${text}"`;
  } else {
    wrap.className = 'chat-a-wrap';
    const inner = document.createElement('div');
    inner.className = 'chat-a';
    inner.textContent = text;
    wrap.appendChild(inner);
  }
  amaChat.appendChild(wrap);
  amaChat.scrollTop = amaChat.scrollHeight;
}

function sendMessage() {
  const val = amaInput.value.trim();
  if (!val) return;
  addMessage(val, true);
  amaInput.value = '';

  const typing = document.createElement('div');
  typing.className = 'typing visible';
  typing.innerHTML = '<span></span><span></span><span></span>';
  amaChat.appendChild(typing);
  amaChat.scrollTop = amaChat.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const reply = responses[Math.floor(Math.random() * responses.length)];
    addMessage(reply, false);
  }, 1200 + Math.random() * 600);
}

amaSend.addEventListener('click', sendMessage);
amaInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

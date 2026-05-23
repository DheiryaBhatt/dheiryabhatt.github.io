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

// ── AMA Lock ──
const AMA_KEY_HASH = '49ad804c3853453980f4ec9dcf69f3dfb3e0db29d1fc5a627c862e1041a23180';

async function sha256ama(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const amaLock      = document.getElementById('amaLock');
const amaKeyInput  = document.getElementById('amaKeyInput');
const amaKeySubmit = document.getElementById('amaKeySubmit');
const lockIconWrap = document.getElementById('lockIconWrap');
const lockDanger   = document.getElementById('lockDanger');
const amaKeyWrap   = document.getElementById('amaKeyWrap');

if (sessionStorage.getItem('ama_unlocked') === 'true') {
  amaLock.remove();
} else {
  amaKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
  amaKeySubmit.addEventListener('click', tryUnlock);
  amaKeyInput.addEventListener('input', () => amaKeyInput.classList.remove('error'));
}

async function tryUnlock() {
  const val = amaKeyInput.value;
  if (!val) return;
  const hash = await sha256ama(val);
  if (hash === AMA_KEY_HASH) {
    sessionStorage.setItem('ama_unlocked', 'true');
    lockIconWrap.classList.add('granted');
    document.getElementById('lockShackle').setAttribute('d', 'M7 10V5a3 3 0 016 0');
    setTimeout(() => {
      amaLock.classList.add('unlocking');
      setTimeout(() => amaLock.remove(), 600);
    }, 380);
  } else {
    amaKeyInput.value = '';
    amaKeyInput.classList.add('error');
    lockDanger.classList.add('visible');
    amaKeyWrap.classList.add('lock-shake');
    setTimeout(() => {
      lockDanger.classList.remove('visible');
      amaKeyWrap.classList.remove('lock-shake');
      amaKeyInput.classList.remove('error');
    }, 1600);
  }
}

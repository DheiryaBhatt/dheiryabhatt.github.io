(function () {
  'use strict';

  var form       = document.getElementById('req-form');
  var card       = document.getElementById('card');
  var btn        = document.getElementById('btn');
  var btnText    = document.getElementById('btn-text');
  var errorEl    = document.getElementById('error-msg');
  var identity   = document.getElementById('identity');
  var designation = document.getElementById('designation');
  var intent     = document.getElementById('intent');
  var reason     = document.getElementById('reason');
  var wrapId     = document.getElementById('wrap-id');
  var wrapIntent = document.getElementById('wrap-intent');
  var charCount  = document.getElementById('charCount');

  // ── Character counter ──
  reason.addEventListener('input', function () {
    charCount.textContent = reason.value.length + ' / 180';
  });

  // ── Clear error state on field interaction ──
  intent.addEventListener('change', function () {
    intent.classList.toggle('placeholder', !intent.value);
    clearError();
  });

  identity.addEventListener('input', clearError);
  designation.addEventListener('input', clearError);

  function clearError() {
    errorEl.style.display = 'none';
    wrapId.classList.remove('error');
    wrapIntent.classList.remove('error');
  }

  function isValidEmail(val) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
  }

  function shakeCard() {
    card.classList.add('shake');
    setTimeout(function () { card.classList.remove('shake'); }, 500);
  }

  function showInlineError(msg) {
    errorEl.textContent = msg || errorEl.textContent;
    errorEl.style.display = 'block';
  }

  // ── Form submit ──
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var idVal     = identity.value.trim();
    var emailOk   = isValidEmail(idVal);
    var intentVal = intent.value;

    if (!emailOk || !intentVal) {
      if (!emailOk)   wrapId.classList.add('error');
      if (!intentVal) wrapIntent.classList.add('error');
      errorEl.textContent = 'Incomplete packet — Identity & intent required';
      errorEl.style.display = 'block';
      shakeCard();
      return;
    }

    btn.disabled = true;
    btnText.textContent = 'Transmitting...';
    errorEl.style.display = 'none';

    var payload = {
      identity:        idVal,
      designation:     designation.value.trim() || idVal,
      clearance_intent: intentVal,
      justification:   reason.value.trim()
    };

    try {
      var res = await fetch('https://cloud.dheiryabhatt.com/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      var data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upstream failure — try again');
      }

      // ── Success ──
      btn.classList.add('success');
      btn.querySelector('.material-symbols-outlined').textContent = 'check';
      btnText.textContent = 'Transmitted';
      card.style.borderColor = 'rgba(34,197,94,0.4)';

      setTimeout(function () {
        document.getElementById('ticketId').textContent = data.ticket_id;
        document.getElementById('request-view').style.display = 'none';
        document.getElementById('confirm-view').style.display = 'block';
        card.style.borderColor = 'rgba(255,255,255,0.1)';
      }, 600);

    } catch (err) {
      btn.disabled = false;
      btnText.textContent = 'Transmit Request';
      btn.querySelector('.material-symbols-outlined').textContent = 'cell_tower';
      showInlineError(err.message || 'Transmission failed — retry');
      shakeCard();
    }
  });

  // ── Back button on confirmation screen ──
  document.getElementById('backBtn').addEventListener('click', function () {
    window.location.href = '/new/login/';
  });
})();

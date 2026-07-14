/* ── Navbar scroll effect ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.style.boxShadow = scrollY > 8 ? '0 4px 32px rgba(0,0,0,.55)' : '';
});

/* ── Hamburger ── */
const burger = document.getElementById('burger');
const mob = document.getElementById('mob');
if (burger && mob) burger.addEventListener('click', () => mob.classList.toggle('open'));

/* ── Active nav link ── */
document.querySelectorAll('.nav-link').forEach(l => {
  if (l.href === location.href) l.classList.add('active');
});

/* ── Auto-dismiss flash messages ── */
setTimeout(() => {
  document.querySelectorAll('.flash').forEach(f => {
    f.style.transition = '.4s'; f.style.opacity = '0';
    f.style.transform = 'translateX(110%)';
    setTimeout(() => f.remove(), 450);
  });
}, 4200);

/* ── Counter animation ── */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  let cur = 0;
  const step = Math.ceil(target / 55);
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString();
    if (cur >= target) clearInterval(t);
  }, 15);
});

/* ── EMI Calculator ── */
async function calcEMI() {
  const p = parseFloat(document.getElementById('loan_amount')?.value) || 0;
  const n = parseInt(document.getElementById('loan_term')?.value)     || 12;
  const r = parseFloat(document.querySelector('[data-rate]')?.dataset.rate) || 12;
  if (!p || !n) return;
  try {
    const res = await fetch('/api/emi', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p, r, n })
    });
    const d = await res.json();
    setEl('emi-emi',   '₹' + d.emi.toLocaleString());
    setEl('emi-total', '₹' + d.total.toLocaleString());
    setEl('emi-int',   '₹' + d.interest.toLocaleString());
  } catch (_) {}
}
function setEl(id, v) { const e = document.getElementById(id); if (e) e.textContent = v; }

/* ── Range slider sync ── */
function syncSlider(inp, display) {
  const v = +inp.value;
  const pfx = inp.dataset.prefix || '';
  const sfx = inp.dataset.suffix || '';
  let txt;
  if (pfx === '₹') {
    if (v >= 1e7) txt = '₹' + (v/1e7).toFixed(1) + ' Cr';
    else if (v >= 1e5) txt = '₹' + (v/1e5).toFixed(1) + ' L';
    else txt = '₹' + v.toLocaleString();
  } else {
    txt = pfx + v.toLocaleString() + sfx;
  }
  if (display) display.textContent = txt;
}

document.querySelectorAll('.slider-group').forEach(g => {
  const inp = g.querySelector('input[type=range]');
  const dsp = g.querySelector('.slider-val');
  if (!inp) return;
  syncSlider(inp, dsp);
  inp.addEventListener('input', () => { syncSlider(inp, dsp); calcEMI(); });
});

/* ── Drag & Drop upload ── */
const zone  = document.getElementById('uploadZone');
const finp  = document.getElementById('docFile');
const fname = document.getElementById('fileName');

function showFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const icons = { pdf:'📄', png:'🖼️', jpg:'🖼️', jpeg:'🖼️', doc:'📝', docx:'📝' };
  if (fname) fname.innerHTML = `${icons[ext]||'📎'} <strong>${file.name}</strong> &nbsp;<span class="txt-m">(${(file.size/1024).toFixed(0)} KB)</span>`;
  if (zone)  { zone.style.borderColor='#22c55e'; zone.style.background='rgba(34,197,94,.05)'; }
}

if (zone && finp) {
  zone.addEventListener('click', () => finp.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('over');
    if (e.dataTransfer.files[0]) { finp.files = e.dataTransfer.files; showFile(e.dataTransfer.files[0]); }
  });
  finp.addEventListener('change', () => finp.files[0] && showFile(finp.files[0]));
}

/* ── PAN uppercase ── */
document.querySelectorAll('[data-pan]').forEach(e => {
  e.addEventListener('input', () => { e.value = e.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10); });
});

/* ── CIBIL Meter Animation ── */
function animCibil(score, circleId) {
  const c = document.getElementById(circleId);
  if (!c) return;
  const r = 90, circ = 2 * Math.PI * r;
  const pct = (score - 300) / 600;
  setTimeout(() => {
    c.style.transition = 'stroke-dashoffset 1.9s cubic-bezier(.4,0,.2,1)';
    c.style.strokeDashoffset = circ * (1 - pct);
  }, 250);
}

/* ── Result Gauge Animation ── */
function animGauge(score) {
  const c = document.getElementById('gauge-arc');
  if (!c) return;
  const r = 80, circ = 2 * Math.PI * r;
  setTimeout(() => {
    c.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)';
    c.style.strokeDashoffset = circ * (1 - score / 100);
  }, 300);
}

/* ── History filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.app-row').forEach(row => {
      row.style.display = (f === 'all' || row.dataset.status === f) ? '' : 'none';
    });
  });
});

/* ── Loan type selection (step1) ── */
document.querySelectorAll('.lt-card').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.lt-card').forEach(x => x.classList.remove('selected'));
    c.classList.add('selected');
    const inp = document.getElementById('selected_type');
    if (inp) inp.value = c.dataset.type;
  });
});

/* ── Submit protection ── */
document.querySelectorAll('form').forEach(f => {
  f.addEventListener('submit', function() {
    const btn = this.querySelector('button[type=submit]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Please wait...'; }
  });
});

/* ── Init on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  // CIBIL meter
  const cv = document.getElementById('cibil-val');
  if (cv) animCibil(+cv.dataset.score, 'cibil-arc');
  // Result gauge
  const rv = document.getElementById('result-val');
  if (rv) animGauge(+rv.dataset.score);
  // Initial EMI calc
  calcEMI();
});

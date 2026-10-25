import './style.css';
import builtIn from './snippets.json';

const CATEGORIES = ['Buttons', 'Forms', 'Cards', 'Loaders', 'Navigation', 'Layout'];
const LOCAL_KEY = 'uidrop-local-v1';
const $ = (id) => document.getElementById(id);

let local = [];
try { local = JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch {}
const saveLocal = () => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(local)); } catch {} };

let category = 'All';
let query = '';

// Every preview runs in a sandboxed iframe with no scripts.
const wrap = (code) =>
  '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%}' +
  'body{display:grid;place-items:center;font-family:system-ui;background:#f4f6fb}</style>' + code;

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast.h);
  toast.h = setTimeout(() => t.classList.remove('on'), 1800);
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function contributionFile() {
  return `<!--\ntitle: ${$('t').value.trim()}\nauthor: ${$('a').value.trim() || '@anonymous'}\ncategory: ${$('g').value}\n-->\n${$('c').value.trim()}\n`;
}

function renderChips() {
  const box = $('chips');
  box.innerHTML = '';
  ['All', ...CATEGORIES].forEach((name) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = name;
    b.setAttribute('aria-pressed', String(name === category));
    b.onclick = () => { category = name; renderChips(); renderGrid(); };
    box.appendChild(b);
  });
}

function renderGrid() {
  const grid = $('grid');
  grid.innerHTML = '';
  const list = [...local, ...builtIn].filter(
    (s) => (category === 'All' || s.category === category) &&
      `${s.title} ${s.author} ${s.category}`.toLowerCase().includes(query)
  );
  if (!list.length) {
    grid.innerHTML = '<div class="empty">No snippets match. Try another search or add your own above.</div>';
    return;
  }
  list.forEach((s) => {
    const card = document.createElement('article');
    card.className = 'card';
    const frame = document.createElement('iframe');
    frame.sandbox = '';
    frame.title = 'Preview of ' + s.title;
    frame.loading = 'lazy';
    frame.srcdoc = wrap(s.code);
    const body = document.createElement('div');
    body.className = 'b';
    const h = document.createElement('h3');
    h.textContent = s.title;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${s.author} in ${s.category}${s.local ? ' (only in your browser)' : ''}`;
    const acts = document.createElement('div');
    acts.className = 'acts';
    const copy = document.createElement('button');
    copy.className = 'ghost';
    copy.textContent = 'Copy code';
    copy.onclick = () => navigator.clipboard.writeText(s.code).then(() => toast('Copied'), () => toast('Copy failed. Use View code.'));
    const view = document.createElement('button');
    view.className = 'ghost';
    view.textContent = 'View code';
    const pre = document.createElement('pre');
    pre.hidden = true;
    pre.textContent = s.code;
    view.onclick = () => { pre.hidden = !pre.hidden; view.textContent = pre.hidden ? 'View code' : 'Hide code'; };
    acts.append(copy, view);
    body.append(h, meta, acts, pre);
    card.append(frame, body);
    grid.appendChild(card);
  });
}

function validate() {
  if (!$('t').value.trim()) { $('msg').textContent = 'Add a title so people can find your snippet.'; $('t').focus(); return false; }
  if (!$('c').value.trim()) { $('msg').textContent = 'Paste some HTML and CSS first.'; $('c').focus(); return false; }
  $('msg').textContent = '';
  return true;
}

$('g').innerHTML = CATEGORIES.map((c) => `<option>${c}</option>`).join('');
$('c').value = builtIn[0]?.code ?? '';
const updatePreview = () => { $('pv').srcdoc = wrap($('c').value); };
updatePreview();
$('c').addEventListener('input', updatePreview);
$('q').addEventListener('input', (e) => { query = e.target.value.toLowerCase().trim(); renderGrid(); });

$('add').onclick = () => {
  if (!validate()) return;
  local.unshift({
    id: 'local-' + Date.now(), title: $('t').value.trim(), author: $('a').value.trim() || '@anonymous',
    category: $('g').value, code: $('c').value.trim(), local: true,
  });
  saveLocal();
  category = 'All';
  renderChips();
  renderGrid();
  toast('Added to your gallery');
  $('gallery').scrollIntoView({ behavior: 'smooth' });
};

$('file').onclick = () => {
  if (!validate()) return;
  navigator.clipboard.writeText(contributionFile()).then(
    () => toast(`Copied. Save it as snippets/${slug($('t').value)}.html`),
    () => toast('Copy failed. Select the code manually.')
  );
};

renderChips();
renderGrid();

const form = document.getElementById('form');
const input = document.getElementById('repoUrl');
const btn = document.getElementById('btn');
const loading = document.getElementById('loading');
const errorEl = document.getElementById('error');
const result = document.getElementById('result');

// Example repo buttons
document.querySelectorAll('.example-btn').forEach((el) => {
  el.addEventListener('click', () => {
    input.value = el.dataset.url;
    form.dispatchEvent(new Event('submit'));
  });
});

// Loading step animation
let stepInterval;
function startLoadingSteps() {
  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];
  let current = 0;
  steps.forEach((s) => s.classList.remove('active'));
  steps[0].classList.add('active');

  stepInterval = setInterval(() => {
    current++;
    if (current < steps.length) {
      steps[current].classList.add('active');
    }
  }, 2000);
}

function stopLoadingSteps() {
  clearInterval(stepInterval);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const repoUrl = input.value.trim();

  if (!repoUrl.startsWith('https://github.com/')) {
    showError('Please enter a valid GitHub URL (https://github.com/owner/repo)');
    return;
  }

  // Reset UI
  errorEl.classList.add('hidden');
  result.classList.add('hidden');
  loading.classList.remove('hidden');
  btn.disabled = true;
  startLoadingSteps();

  try {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');

    renderResult(data, repoUrl);
  } catch (err) {
    showError(err.message);
  } finally {
    stopLoadingSteps();
    loading.classList.add('hidden');
    btn.disabled = false;
  }
});

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

function renderResult(data, repoUrl) {
  // Re-trigger animations
  document.querySelectorAll('.animate-in').forEach((el) => {
    el.style.animation = 'none';
    el.offsetHeight; // force reflow
    el.style.animation = '';
  });

  // Name
  const nameEl = document.getElementById('repoName');
  nameEl.innerHTML = `<a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener">${escapeHtml(data.name || 'Unknown')}</a>`;

  // Language
  const langEl = document.getElementById('language');
  langEl.textContent = data.language || 'N/A';

  // Complexity
  const compEl = document.getElementById('complexity');
  const level = (data.complexity || 'moderate').toLowerCase();
  compEl.textContent = level.charAt(0).toUpperCase() + level.slice(1);
  compEl.dataset.level = level;

  // Stars
  const starsEl = document.getElementById('stars');
  starsEl.textContent = data.stars != null ? `★ ${data.stars.toLocaleString()}` : '';

  // Purpose & Architecture
  document.getElementById('purpose').textContent = data.purpose || '';
  document.getElementById('architecture').textContent = data.architecture || '';

  // Tech Stack
  const stackEl = document.getElementById('techStack');
  stackEl.innerHTML = '';
  (data.techStack || []).forEach((t) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    stackEl.appendChild(span);
  });

  // Key Features
  const featEl = document.getElementById('keyFeatures');
  featEl.innerHTML = '';
  (data.keyFeatures || []).forEach((f) => {
    const li = document.createElement('li');
    li.textContent = f;
    featEl.appendChild(li);
  });

  result.classList.remove('hidden');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

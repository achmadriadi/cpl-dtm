// final main.js with close/reset + modal handling

// LOGIN GUARD
if (sessionStorage.getItem('loggedIn') !== 'true') {
  window.location = 'index.html';
} else {
  const ul = document.getElementById('userLabel');
  if (ul) ul.textContent = 'Logged in as ' + (sessionStorage.getItem('username') || '');
}

// LOGOUT
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.onclick = () => { sessionStorage.clear(); window.location = 'index.html'; };

// IMAGE UPDATES
function updateImgMhs() {
  const p = document.getElementById('prodiMhs').value;
  const s = document.getElementById('semesterMhs').value;
  const img = document.getElementById('imgMhs');
  if (p && s) { img.src = `assets/img/cpl_per_mhs/${p}/${s}/grafik.png`; img.classList.remove('d-none'); }
  else { img.src = ''; img.classList.add('d-none'); }
}
function updateImgProdi() {
  const p = document.getElementById('prodiProdi').value;
  const a = document.getElementById('angkatanProdi').value;
  const img = document.getElementById('imgProdi');
  if (p && a) { img.src = `assets/img/cpl_prodi/${p}/${a}/grafik.png`; img.classList.remove('d-none'); }
  else { img.src = ''; img.classList.add('d-none'); }
}
document.getElementById('prodiMhs').addEventListener('change', updateImgMhs);
document.getElementById('semesterMhs').addEventListener('change', updateImgMhs);
document.getElementById('prodiProdi').addEventListener('change', updateImgProdi);
document.getElementById('angkatanProdi').addEventListener('change', updateImgProdi);

// LOAD GOOGLE FORM LINKS
async function loadGoogleForms() {
  try {
    const r = await fetch('data/google_form_links.json');
    const d = await r.json();
    window.googleForms = {};
    (d.semesters || []).forEach(s => window.googleForms[s.id] = s.form_url);
  } catch (e) {
    window.googleForms = {};
  }
}
loadGoogleForms();

// MODAL & FORM HANDLING
const modalEl = document.getElementById('googleFormModal');
const iframe = document.getElementById('googleFormFrame');
const loader = document.getElementById('formLoader');
const evalSelect = document.getElementById('evalSemester');

async function openFormForSelectedSemester(selected) {
  if (!selected || !window.googleForms[selected]) return;
  // reset/hide iframe then show loader
  iframe.style.display = 'none';
  loader.style.display = 'block';
  iframe.src = window.googleForms[selected];

  // show modal
  const modalInstance = new bootstrap.Modal(modalEl, {backdrop: true});
  modalInstance.show();

  // when iframe loads
  iframe.onload = () => {
    loader.style.display = 'none';
    iframe.style.display = 'block';
  };

  // ensure we store reference so close can use hide()
  modalEl._bs_instance = modalInstance;
}

// Open when dropdown changes
evalSelect.addEventListener('change', function () {
  const selected = this.value;
  if (!selected) return;
  openFormForSelectedSemester(selected);
});

// CUSTOM CLOSE BUTTON behavior: reset dropdown, clear iframe, hide modal
const modalCloseBtn = document.getElementById('modalCloseBtn');
function closeFormModal() {
  // hide modal (use stored instance)
  try {
    if (modalEl && modalEl._bs_instance) modalEl._bs_instance.hide();
    else {
      const instance = bootstrap.Modal.getInstance(modalEl);
      if (instance) instance.hide();
    }
  } catch (e) { /* ignore */ }

  // reset dropdown selection
  if (evalSelect) { evalSelect.value = ''; }

  // clear iframe src and hide it
  if (iframe) {
    iframe.src = '';
    iframe.style.display = 'none';
  }

  // hide loader
  if (loader) loader.style.display = 'none';
}
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeFormModal);

// Also reset if user closes modal by clicking backdrop or pressing ESC
modalEl.addEventListener('hidden.bs.modal', function () {
  // do same reset
  if (evalSelect) evalSelect.value = '';
  if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
  if (loader) loader.style.display = 'none';
});

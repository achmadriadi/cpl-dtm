/* ===== LOGIN GUARD ===== */
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location = 'index.html';
} else {
    document.getElementById('userLabel').textContent =
      'Logged in as ' + sessionStorage.getItem('username');
}

/* ===== LOGOUT ===== */
document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.clear();
    window.location = 'index.html';
};

/* ===== GOOGLE FORM JSON ===== */
let googleForms = {};

fetch('data/google_form_links.json')
  .then(r => r.json())
  .then(data => {
      data.semesters.forEach(s => googleForms[s.id] = s.form_url);
  });

/* ===== ELEMENTS ===== */
const modalEl = document.getElementById('googleFormModal');
const iframe = document.getElementById('googleFormFrame');
const loader = document.getElementById('formLoader');
const closeBtn = document.getElementById('closeFloatBtn');
const evalSelect = document.getElementById('evalSemester');

/* ===== OPEN MODAL ===== */
function openForm(id) {
    iframe.style.display = "none";
    loader.style.display = "block";
    iframe.src = googleForms[id];

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl._instance = modal;

    closeBtn.style.display = "block";

    iframe.onload = () => {
        loader.style.display = "none";
        iframe.style.display = "block";
    };
}

evalSelect.onchange = () => {
    if (evalSelect.value) openForm(evalSelect.value);
};

/* ===== CLOSE ===== */
function closeForm() {
    try { modalEl._instance.hide(); } catch (e) {}

    iframe.src = "";
    iframe.style.display = "none";
    loader.style.display = "none";
    closeBtn.style.display = "none";
    evalSelect.value = "";
}

closeBtn.onclick = closeForm;
modalEl.addEventListener("hidden.bs.modal", closeForm);

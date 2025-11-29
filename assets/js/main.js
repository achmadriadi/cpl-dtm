/* LOGIN CHECK */
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location = 'index.html';
} else {
    document.getElementById('userLabel').textContent =
        'Logged in as ' + sessionStorage.getItem('username');
}

/* LOGOUT */
document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.clear();
    window.location = 'index.html';
};

/* LOAD GOOGLE FORM JSON */
let googleForms = {};

fetch('data/google_form_links.json')
  .then(r => r.json())
  .then(data => {
      data.semesters.forEach(s => googleForms[s.id] = s.form_url);
  });

/* ELEMENTS */
const modalEl = document.getElementById('googleFormModal');
const iframe = document.getElementById('googleFormFrame');
const loader = document.getElementById('formLoader');
const closeBtn = document.getElementById('closeFloatBtn');
const evalSelect = document.getElementById('evalSemester');

/* OPEN GOOGLE FORM */
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

/* CLOSE FORM */
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

/* DROPDOWN IMAGE FIX */
function updateImgMhs() {
    const p = document.getElementById('prodiMhs').value;
    const s = document.getElementById('semesterMhs').value;
    const img = document.getElementById('imgMhs');

    if (p && s) {
        img.src = `assets/img/cpl_per_mhs/${p}/${s}/grafik.png`;
        img.classList.remove('d-none');
    } else {
        img.classList.add('d-none');
        img.src = "";
    }
}

function updateImgProdi() {
    const p = document.getElementById('prodiProdi').value;
    const a = document.getElementById('angkatanProdi').value;
    const img = document.getElementById('imgProdi');

    if (p && a) {
        img.src = `assets/img/cpl_prodi/${p}/${a}/grafik.png`;
        img.classList.remove('d-none');
    } else {
        img.classList.add('d-none');
        img.src = "";
    }
}

document.getElementById('prodiMhs').onchange = updateImgMhs;
document.getElementById('semesterMhs').onchange = updateImgMhs;

document.getElementById('prodiProdi').onchange = updateImgProdi;
document.getElementById('angkatanProdi').onchange = updateImgProdi;

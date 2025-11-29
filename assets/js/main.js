/* =========================================================
   LOGIN GUARD
========================================================= */
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location = 'index.html';
} else {
    const label = document.getElementById('userLabel');
    if (label) label.textContent = 'Logged in as ' + sessionStorage.getItem('username');
}

/* =========================================================
   LOGOUT
========================================================= */
document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.clear();
    window.location = 'index.html';
};

/* =========================================================
   IMAGE HANDLERS
========================================================= */
function updateImgMhs() {
    let p = document.getElementById('prodiMhs').value;
    let s = document.getElementById('semesterMhs').value;
    let img = document.getElementById('imgMhs');

    if (p && s) {
        img.src = `assets/img/cpl_per_mhs/${p}/${s}/grafik.png`;
        img.classList.remove('d-none');
    } else {
        img.src = '';
        img.classList.add('d-none');
    }
}

function updateImgProdi() {
    let p = document.getElementById('prodiProdi').value;
    let a = document.getElementById('angkatanProdi').value;
    let img = document.getElementById('imgProdi');

    if (p && a) {
        img.src = `assets/img/cpl_prodi/${p}/${a}/grafik.png`;
        img.classList.remove('d-none');
    } else {
        img.src = '';
        img.classList.add('d-none');
    }
}

document.getElementById('prodiMhs').onchange = updateImgMhs;
document.getElementById('semesterMhs').onchange = updateImgMhs;

document.getElementById('prodiProdi').onchange = updateImgProdi;
document.getElementById('angkatanProdi').onchange = updateImgProdi;

/* =========================================================
   LOAD GOOGLE FORM LINKS
========================================================= */
let googleForms = {};

async function loadGoogleForms() {
    try {
        const res = await fetch('data/google_form_links.json');
        const data = await res.json();
        
        data.semesters.forEach(s => {
            googleForms[s.id] = s.form_url;
        });
    } catch (e) {
        console.error("Error loading form JSON:", e);
    }
}

loadGoogleForms();

/* =========================================================
   MODAL CONTROL
========================================================= */
const modalEl = document.getElementById('googleFormModal');
const iframe = document.getElementById('googleFormFrame');
const loader = document.getElementById('formLoader');
const evalSelect = document.getElementById('evalSemester');
const closeBtn = document.getElementById('closeFloatBtn');

function openForm(id) {
    iframe.style.display = 'none';
    loader.style.display = 'block';

    iframe.src = googleForms[id];

    const modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
    modalEl._instance = modalInstance;

    closeBtn.style.display = "block";

    iframe.onload = () => {
        loader.style.display = 'none';
        iframe.style.display = 'block';
    };
}

evalSelect.onchange = function () {
    if (this.value) openForm(this.value);
};

/* =========================================================
   CLOSE MODAL
========================================================= */
function closeForm() {

    try {
        modalEl._instance.hide();
    } catch (e) {}

    evalSelect.value = "";
    iframe.src = "";
    iframe.style.display = "none";
    loader.style.display = "none";
    closeBtn.style.display = "none";
}

closeBtn.onclick = closeForm;

modalEl.addEventListener('hidden.bs.modal', closeForm);

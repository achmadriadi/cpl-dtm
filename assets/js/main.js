/* =========================================================
   LOGIN GUARD
========================================================= */
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location = 'index.html';
} else {
    const label = document.getElementById('userLabel');
    if (label) {
        label.textContent = 'Logged in as ' + (sessionStorage.getItem('username') || '');
    }
}

/* =========================================================
   LOGOUT
========================================================= */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = () => {
        sessionStorage.clear();
        window.location = 'index.html';
    };
}

/* =========================================================
   IMAGE HANDLER
========================================================= */
function updateImgMhs() {
    const p = document.getElementById('prodiMhs').value;
    const s = document.getElementById('semesterMhs').value;
    const img = document.getElementById('imgMhs');

    if (p && s) {
        img.src = `assets/img/cpl_per_mhs/${p}/${s}/grafik.png`;
        img.classList.remove('d-none');
    } else {
        img.src = '';
        img.classList.add('d-none');
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
        img.src = '';
        img.classList.add('d-none');
    }
}

document.getElementById('prodiMhs').addEventListener('change', updateImgMhs);
document.getElementById('semesterMhs').addEventListener('change', updateImgMhs);

document.getElementById('prodiProdi').addEventListener('change', updateImgProdi);
document.getElementById('angkatanProdi').addEventListener('change', updateImgProdi);

/* =========================================================
   LOAD GOOGLE FORM LINKS
========================================================= */
async function loadGoogleForms() {
    try {
        const r = await fetch('data/google_form_links.json');
        const d = await r.json();
        window.googleForms = {};

        (d.semesters || []).forEach(s => {
            window.googleForms[s.id] = s.form_url;
        });
    } catch (e) {
        console.error("JSON Load Error:", e);
        window.googleForms = {};
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

function openForm(id) {
    if (!id || !window.googleForms[id]) return;

    iframe.style.display = 'none';
    loader.style.display = 'block';
    iframe.src = window.googleForms[id];

    const modalInstance = new bootstrap.Modal(modalEl, { backdrop: true });
    modalInstance.show();

    modalEl._bs_instance = modalInstance;

    iframe.onload = () => {
        loader.style.display = 'none';
        iframe.style.display = 'block';
    };
}

evalSelect.addEventListener('change', function () {
    const id = this.value;
    if (!id) return;
    openForm(id);
});

/* =========================================================
   FLOATING CLOSE BUTTON (X)
========================================================= */
const closeFloatBtn = document.getElementById('closeFloatBtn');

function closeFormModal() {
    try {
        if (modalEl._bs_instance) modalEl._bs_instance.hide();
        else {
            const instance = bootstrap.Modal.getInstance(modalEl);
            if (instance) instance.hide();
        }
    } catch (e) { }

    evalSelect.value = '';
    iframe.src = '';
    iframe.style.display = 'none';
    loader.style.display = 'none';
}

closeFloatBtn.addEventListener('click', closeFormModal);

/* =========================================================
   RESET WHEN CLOSED (ESC/BACKDROP)
========================================================= */
modalEl.addEventListener('hidden.bs.modal', function () {
    evalSelect.value = '';
    iframe.src = '';
    iframe.style.display = 'none';
    loader.style.display = 'none';
});

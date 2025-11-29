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
   LOGOUT BUTTON
========================================================= */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = () => {
        sessionStorage.clear();
        window.location = 'index.html';
    };
}

/* =========================================================
   IMAGE FUNCTIONS
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
   LOAD GOOGLE FORM DATA
========================================================= */
async function loadGoogleForms() {
    try {
        const response = await fetch('data/google_form_links.json');
        const data = await response.json();
        window.googleForms = {};

        (data.semesters || []).forEach(item => {
            window.googleForms[item.id] = item.form_url;
        });
    } catch (error) {
        console.error("Error loading Google Form JSON:", error);
        window.googleForms = {};
    }
}

loadGoogleForms();

/* =========================================================
   MODAL + GOOGLE FORM HANDLING
========================================================= */
const modalEl = document.getElementById('googleFormModal');
const iframe = document.getElementById('googleFormFrame');
const loader = document.getElementById('formLoader');
const evalSelect = document.getElementById('evalSemester');

async function openForm(selected) {
    if (!selected || !window.googleForms[selected]) return;

    // Reset view
    iframe.style.display = 'none';
    loader.style.display = 'block';
    iframe.src = window.googleForms[selected];

    // Show modal
    const modalInstance = new bootstrap.Modal(modalEl, { backdrop: true });
    modalInstance.show();
    modalEl._bs_instance = modalInstance;

    iframe.onload = () => {
        loader.style.display = 'none';
        iframe.style.display = 'block';
    };
}

evalSelect.addEventListener('change', function () {
    const selected = this.value;
    if (!selected) return;
    openForm(selected);
});

/* =========================================================
   CLOSE FLOAT BUTTON (X)
========================================================= */
const closeFloatBtn = document.getElementById('closeFloatBtn');

function closeFormModal() {
    try {
        if (modalEl._bs_instance) {
            modalEl._bs_instance.hide();
        } else {
            const instance = bootstrap.Modal.getInstance(modalEl);
            if (instance) instance.hide();
        }
    } catch (e) { }

    // Reset dropdown
    if (evalSelect) evalSelect.value = '';

    // Clear iframe
    iframe.src = '';
    iframe.style.display = 'none';

    // Hide loader
    loader.style.display = 'none';
}

if (closeFloatBtn) {
    closeFloatBtn.addEventListener('click', closeFormModal);
}

/* =========================================================
   AUTO RESET IF MODAL CLOSED VIA BACKDROP / ESC
========================================================= */
modalEl.addEventListener('hidden.bs.modal', function () {
    if (evalSelect) evalSelect.value = '';
    iframe.src = '';
    iframe.style.display = 'none';
    loader.style.display = 'none';
});

// =============================================
//  LOGIN GUARD
// =============================================
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'index.html';
} else {
    document.getElementById('userLabel').textContent =
        'Logged in as ' + (sessionStorage.getItem('username') || '');
}

document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = 'index.html';
});


// =============================================
//  IMAGE UPDATE – PER MAHASISWA
// =============================================
function updateImgMhs() {
    const prodi = document.getElementById('prodiMhs').value;
    const sem = document.getElementById('semesterMhs').value;
    const img = document.getElementById('imgMhs');

    if (prodi && sem) {
        img.src = `assets/img/cpl_per_mhs/${prodi}/${sem}/grafik.png`;
        img.classList.remove('d-none');
    } else {
        img.src = '';
        img.classList.add('d-none');
    }
}

// =============================================
//  IMAGE UPDATE – PRODI
// =============================================
function updateImgProdi() {
    const prodi = document.getElementById('prodiProdi').value;
    const ang = document.getElementById('angkatanProdi').value;
    const img = document.getElementById('imgProdi');

    if (prodi && ang) {
        img.src = `assets/img/cpl_prodi/${prodi}/${ang}/grafik.png`;
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


// =============================================
//  LOAD GOOGLE FORM LINKS FROM JSON
// =============================================
async function loadGoogleForms() {
    try {
        const res = await fetch('data/google_form_links.json');
        const data = await res.json();

        window.googleForms = {};
        (data.semesters || []).forEach(s => {
            window.googleForms[s.id] = s.form_url;
        });

    } catch (e) {
        window.googleForms = {};
    }
}

loadGoogleForms();


// =============================================
//  HANDLE GOOGLE FORM MODAL + LOADER
// =============================================
document.getElementById('evalSemester').addEventListener('change', async function () {

    const selected = this.value;
    if (!selected || !window.googleForms[selected]) return;

    const frame = document.getElementById("googleFormFrame");
    const loader = document.getElementById("formLoader");

    // Reset iframe & show loader
    frame.style.display = "none";
    loader.style.display = "block";
    frame.src = window.googleForms[selected];

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("googleFormModal"));
    modal.show();

    // When iframe finishes loading
    frame.onload = function () {
        loader.style.display = "none";   // hide loader
        frame.style.display = "block";   // show form
    };
});

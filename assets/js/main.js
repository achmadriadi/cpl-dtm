/* LOGIN GUARD */
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location = "index.html";
} else {
    document.getElementById("userLabel").textContent =
        "Logged in as " + sessionStorage.getItem("username");
}

/* FIX HEADER HEIGHT */
window.addEventListener("load", function () {
    const hh = document.getElementById("appHeader").offsetHeight;
    document.documentElement.style.setProperty("--header-height", hh + "px");
});

/* LOGOUT */
document.getElementById("logoutBtn").onclick = () => {
    sessionStorage.clear();
    window.location = "index.html";
};

/* ELEMENTS */
const panel = document.getElementById("googleFormPanel");
const iframe = document.getElementById("googleFormFrame");
const loader = document.getElementById("formLoader");
const closeBtn = document.getElementById("closeFloatBtn");
const evalSelect = document.getElementById("evalSemester");

/* LOAD JSON FORM LINKS */
let googleForms = {};

fetch("data/google_form_links.json")
    .then(r => r.json())
    .then(d => d.semesters.forEach(s => googleForms[s.id] = s.form_url));

/* SHOW GOOGLE FORM */
function openForm(id) {
    panel.style.display = "block";
    loader.style.display = "block";

    iframe.src = googleForms[id];
    iframe.onload = () => {
        loader.style.display = "none";
        iframe.style.display = "block";
    };

    closeBtn.style.display = "block";
}

evalSelect.onchange = () => {
    if (evalSelect.value) openForm(evalSelect.value);
};

/* CLOSE FORM */
function closeForm() {
    panel.style.display = "none";
    iframe.src = "";
    iframe.style.display = "none";
    loader.style.display = "none";
    closeBtn.style.display = "none";
    evalSelect.value = "";
}

closeBtn.onclick = closeForm;

/* IMAGE LOADERS */
function updateImgMhs() {
    const p = document.getElementById("prodiMhs").value;
    const s = document.getElementById("semesterMhs").value;
    const img = document.getElementById("imgMhs");

    if (p && s) {
        img.src = `assets/img/cpl_per_mhs/${p}/${s}/grafik.png`;
        img.classList.remove("d-none");
    } else {
        img.src = "";
        img.classList.add("d-none");
    }
}

function updateImgProdi() {
    const p = document.getElementById("prodiProdi").value;
    const a = document.getElementById("angkatanProdi").value;
    const img = document.getElementById("imgProdi");

    if (p && a) {
        img.src = `assets/img/cpl_prodi/${p}/${a}/grafik.png`;
        img.classList.remove("d-none");
    } else {
        img.src = "";
        img.classList.add("d-none");
    }
}

document.getElementById("prodiMhs").onchange = updateImgMhs;
document.getElementById("semesterMhs").onchange = updateImgMhs;

document.getElementById("prodiProdi").onchange = updateImgProdi;
document.getElementById("angkatanProdi").onchange = updateImgProdi;

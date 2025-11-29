
// guard: redirect to login if not logged
if(sessionStorage.getItem('loggedIn') !== 'true'){
  window.location.href = 'index.html';
} else {
  document.getElementById('userLabel').textContent = 'Logged in as ' + (sessionStorage.getItem('username')||'');
}

document.getElementById('logoutBtn').addEventListener('click', function(){
  sessionStorage.clear();
  window.location.href = 'index.html';
});

// image updates for per mahasiswa
function updateImgMhs(){
  const prodi = document.getElementById('prodiMhs').value;
  const sem = document.getElementById('semesterMhs').value;
  const img = document.getElementById('imgMhs');
  if(prodi && sem){
    img.src = 'assets/img/cpl_per_mhs/' + prodi + '/' + sem + '/grafik.png';
    img.classList.remove('d-none');
  } else {
    img.src = '';
    img.classList.add('d-none');
  }
}

// image updates for prodi
function updateImgProdi(){
  const prodi = document.getElementById('prodiProdi').value;
  const ang = document.getElementById('angkatanProdi').value;
  const img = document.getElementById('imgProdi');
  if(prodi && ang){
    img.src = 'assets/img/cpl_prodi/' + prodi + '/' + ang + '/grafik.png';
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

// load google form mapping from json
async function loadGoogleForms(){
  try{
    const res = await fetch('data/google_form_links.json');
    const data = await res.json();
    // data.semesters is array of objects {id,name,form_url}
    window.googleForms = {};
    (data.semesters||[]).forEach(s=> window.googleForms[s.id] = s.form_url);
  }catch(e){
    window.googleForms = {};
  }
}

loadGoogleForms();

document.getElementById('evalSemester').addEventListener('change', function(){
  const id = this.value;
  const box = document.getElementById('googleFormBox');
  const frame = document.getElementById('googleFormFrame');
  if(!id || !window.googleForms[id]){
    box.classList.add('d-none');
    frame.src = '';
  } else {
    frame.src = window.googleForms[id];
    box.classList.remove('d-none');
  }
});

// final main.js
if(sessionStorage.getItem('loggedIn')!=='true'){window.location='index.html';}
else{document.getElementById('userLabel').textContent='Logged in as '+sessionStorage.getItem('username');}

document.getElementById('logoutBtn').onclick=()=>{sessionStorage.clear();window.location='index.html';};

function updateImgMhs(){
let p=document.getElementById('prodiMhs').value;
let s=document.getElementById('semesterMhs').value;
let img=document.getElementById('imgMhs');
if(p&&s){img.src='assets/img/cpl_per_mhs/'+p+'/'+s+'/grafik.png';img.classList.remove('d-none');}
else{img.classList.add('d-none');}
}

function updateImgProdi(){
let p=document.getElementById('prodiProdi').value;
let a=document.getElementById('angkatanProdi').value;
let img=document.getElementById('imgProdi');
if(p&&a){img.src='assets/img/cpl_prodi/'+p+'/'+a+'/grafik.png';img.classList.remove('d-none');}
else{img.classList.add('d-none');}
}

document.getElementById('prodiMhs').onchange=updateImgMhs;
document.getElementById('semesterMhs').onchange=updateImgMhs;
document.getElementById('prodiProdi').onchange=updateImgProdi;
document.getElementById('angkatanProdi').onchange=updateImgProdi;

async function loadGoogleForms(){
try{
let r=await fetch('data/google_form_links.json');
let d=await r.json();
window.googleForms={};d.semesters.forEach(s=>window.googleForms[s.id]=s.form_url);
}catch(e){window.googleForms={};}
}
loadGoogleForms();

document.getElementById('evalSemester').addEventListener('change', async function(){
let sel=this.value;
if(!sel||!window.googleForms[sel])return;
let frame=document.getElementById('googleFormFrame');
let loader=document.getElementById('formLoader');
frame.style.display='none';loader.style.display='block';frame.src=window.googleForms[sel];
let modal=new bootstrap.Modal(document.getElementById('googleFormModal'));modal.show();
frame.onload=()=>{loader.style.display='none';frame.style.display='block';};
});


async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

document.getElementById('loginBtn').addEventListener('click', tryLogin);
document.getElementById('loginForm').addEventListener('submit', function(e){ e.preventDefault(); tryLogin(); });

async function tryLogin(){
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const errorBox = document.getElementById('errorMsg');
  errorBox.classList.add('d-none');
  if(!user || !pass){
    errorBox.textContent = 'Username dan password harus diisi.';
    errorBox.classList.remove('d-none');
    return;
  }
  const hashed = await sha256(pass);
  let users = [];
  try{
    const res = await fetch('data/users.json');
    users = await res.json();
  }catch(e){
    errorBox.textContent = 'Gagal memuat data users.';
    errorBox.classList.remove('d-none');
    return;
  }
  const match = users.find(u => u.username === user && u.password === hashed);
  if(!match){
    errorBox.textContent = 'Credential salah.';
    errorBox.classList.remove('d-none');
    return;
  }
  sessionStorage.setItem('loggedIn','true');
  sessionStorage.setItem('username', user);
  window.location.href = 'main.html';
}

document.addEventListener('keydown', function(e){
  if(e.key === 'Enter' && (document.activeElement.tagName==='INPUT')) {
    tryLogin();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
const ambient = document.getElementById('ambient');
const hb = document.getElementById('heartbeat');
const muteBtn = document.getElementById('muteBtn');
const barFill = document.getElementById('barFill');
const detValue = document.getElementById('detValue');
const status = document.getElementById('status');
const detector = document.getElementById('detector');

let isMuted = false;
let hbInterval = null; // pour le battement continu

function toggleMute(){
  isMuted=!isMuted;
  ambient.muted=isMuted;
  hb.muted=isMuted;
  muteBtn.textContent=isMuted?'Son off (M)':'Son on (M)';
  
  if(!isMuted && ambient.paused){
    ambient.play().catch(err => console.log("Autoplay bloqué :", err));
  }
}

// 💓 version battement unique (si tu veux garder le bouton H)
function triggerHeartbeatOnce(){
  detector.classList.add('pulse');
  setTimeout(()=>detector.classList.remove('pulse'),1000);
  hb.currentTime = 0;
  hb.play().catch(err => console.log("Lecture du heartbeat bloquée:", err));
}

// 💓 démarrage d’un rythme cardiaque continu
function startHeartbeat(bpm = 60){
  if(hbInterval) return; // évite de doubler les intervalles
  const interval = 60000 / bpm; 
  hbInterval = setInterval(() => {
    detector.classList.add('pulse');
    setTimeout(()=>detector.classList.remove('pulse'),500);
    hb.currentTime = 0;
    hb.play().catch(err => console.log("Lecture bloquée:", err));
  }, interval);
}

// 💓 arrêt du rythme cardiaque
function stopHeartbeat(){
  clearInterval(hbInterval);
  hbInterval = null;
}

muteBtn.addEventListener('click',toggleMute);
window.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='h')triggerHeartbeatOnce();
  if(e.key.toLowerCase()==='m')toggleMute();
});

window.addEventListener('mousemove',e=>{
  const xRatio=e.clientX/window.innerWidth;
  const yRatio=e.clientY/window.innerHeight;
  const val=(xRatio*10)+(yRatio*5);
  updateUI(val);
});

function updateUI(val){
  const display=val.toFixed(1);
  detValue.textContent=display;
  const w=Math.min(100,Math.max(6,(val/15)*100));
  barFill.style.width=w+'%';
  
  if(val > 7){
    status.innerHTML='Statut : <span style="color:#ff9ca3">ANOMALIE DÉTECTÉE</span>';
    startHeartbeat(70); // ici tu règles la vitesse (BPM)
  } else {
    status.innerHTML='Statut : <span style="color:#b6f0c8">Aucune anomalie</span>';
    stopHeartbeat();
  }
}

// Sélectionne tous les éléments à animer
const animElems = document.querySelectorAll('.fade-up, .fade-left');

function handleScroll() {
  const triggerBottom = window.innerHeight * 0.9; // déclenche à 90% de la hauteur

  animElems.forEach(elem => {
    const elemTop = elem.getBoundingClientRect().top;

    if (elemTop < triggerBottom) {
      elem.classList.add('show');
    }
  });
}

// Au scroll
window.addEventListener('scroll', handleScroll);

// Au chargement
window.addEventListener('load', () => {
  animElems.forEach(elem => elem.classList.add('show'));
});
// ===== MENU BURGER =====
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burgerBtn");
  const navMenu = document.getElementById("navMenu");
  const bgVideo = document.querySelector(".bg-video");
  const vignette = document.querySelector(".overlay-vignette");
  const scanlines = document.querySelector(".scanlines");

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener("click", () => {
      const isActive = burgerBtn.classList.toggle("active");
      navMenu.classList.toggle("show");
      document.body.classList.toggle("menu-open", isActive);

      // Cache ou affiche les effets
      [bgVideo, vignette, scanlines].forEach(el => {
        if (!el) return;
        el.classList.toggle("hidden-bg", isActive);
      });
    });

    // Ferme le menu quand on clique sur un lien
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        burgerBtn.classList.remove("active");
        navMenu.classList.remove("show");
        document.body.classList.remove("menu-open");

        [bgVideo, vignette, scanlines].forEach(el => {
          if (!el) return;
          el.classList.remove("hidden-bg");
        });
      });
    });
  }
});

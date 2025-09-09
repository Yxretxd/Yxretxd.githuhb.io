AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' });

// Active nav link & scroll spy
const sections = [...document.querySelectorAll('main section')];
const navLinks = [...document.querySelectorAll('nav a')];

function setActiveLink() {
  let current = sections[0].id;
  for (const sec of sections) {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) { current = sec.id; break; }
  }
  navLinks.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === '#' + current));
}
document.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('load', setActiveLink);
navLinks.forEach(link => link.addEventListener('click', e => {
  navLinks.forEach(l => l.classList.remove('active-link'));
  e.currentTarget.classList.add('active-link');
}));

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt || 'Imagen ampliada';
    lb.classList.add('open');
  });
});
lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) lb.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });

// Leaflet load + map init
async function loadLeaflet() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
  return new Promise(resolve => { script.onload = resolve; document.body.appendChild(script); });
}

async function initMap() {
  await loadLeaflet();
  const map = L.map('map').setView([9.9338, -84.0707], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
  const institutions = [
    { name: 'Asamblea Legislativa', lat: 9.9338, lng: -84.0707, desc: 'Centro del poder legislativo, localizado en el municipio de San José.' },
    { name: 'Tribunal Supremo de Elecciones', lat: 9.9342, lng: -84.0770, desc: 'Sede administrativa para elecciones justas y transparentes.' },
    { name: 'Corte Suprema de Justicia', lat: 9.9360, lng: -84.0775, desc: 'Tribunal supremo para justicia imparcial y derechos fundamentales.' },
    { name: 'Museo Casa de Presidente', lat: 9.9368, lng: -84.0715, desc: 'Centro histórico sobre figuras presidenciales y evolución democrática.' }
  ];
  institutions.forEach(inst => {
    L.marker([inst.lat, inst.lng]).addTo(map).bindPopup(`<strong>${inst.name}</strong><br>${inst.desc}`);
  });
}
// Init map once visible
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { initMap(); mapObserver.disconnect(); } });
}, { threshold: 0.2 });
mapObserver.observe(document.getElementById('map'));

/* ====================================================
   script.js — Portfolio Interactivity
   ==================================================== */

// ── Cursor Glow
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ── Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger menu (mobile)
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const isOpen = links.style.display === 'flex';
  links.style.display = isOpen ? 'none' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '68px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.background = 'rgba(5,8,17,0.97)';
  links.style.padding = '1rem 5%';
  links.style.gap = '1rem';
  links.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
});

// ── Typed Role Text
const roles = [
  'Software Engineer Intern',
  'Full-Stack Developer',
  'AI / ML Enthusiast',
  'Problem Solver',
];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-role');

function typeRole() {
  const current = roles[roleIdx];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, isDeleting ? 50 : 90);
}
typeRole();

// ── Particle Canvas
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.hue = Math.random() > 0.5 ? 210 : 280; // blue or purple
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,178,240,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Intersection Observer (reveal on scroll)
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.section-label, .section-title, .skill-category, .project-card, .edu-card, .contact-card'
).forEach(el => sectionObserver.observe(el));

// stagger skill categories
document.querySelectorAll('.skill-category').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

// stagger project cards
document.querySelectorAll('.project-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

// stagger contact cards
document.querySelectorAll('.contact-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

// ── Counter animation
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 1500;
      const start = performance.now();
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + (progress < 1 ? '' : '+');
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + '+';
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ── Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

// Add active nav style dynamically
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--accent); } .nav-link.active::after { width: 100%; }`;
document.head.appendChild(style);

// ── Smooth close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (window.innerWidth <= 900) {
      links.style.display = 'none';
    }
  });
});

// ── Skill tag tooltip with level
document.querySelectorAll('.skill-tag[data-level]').forEach(tag => {
  const level = tag.getAttribute('data-level');
  tag.title = `Proficiency: ${level}%`;
  tag.addEventListener('mouseenter', function() {
    this.style.boxShadow = `0 0 12px rgba(108,178,240,${level / 400})`;
  });
  tag.addEventListener('mouseleave', function() {
    this.style.boxShadow = '';
  });
});

// ── Project card tilt effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Page load animation complete
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.animation = 'pageLoad 0.5s ease forwards';
  const style2 = document.createElement('style');
  style2.textContent = `@keyframes pageLoad { from { opacity: 0; } to { opacity: 1; } }`;
  document.head.appendChild(style2);
});

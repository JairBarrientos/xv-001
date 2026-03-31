/* ══════════════════════════════════════════════════
   XV AÑOS — YADIRA LIZETH
   script.js
══════════════════════════════════════════════════ */


/* ════════════════════════════════════════
   ESTRELLAS — se generan automáticamente
   ✏️ Cambia el 35 para más o menos estrellas
   (no tocar el resto)
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  const starsEl = document.getElementById('stars');
  if (starsEl) {
    const cantidad = 60; /* ✏️ número de estrellas */
    for (let i = 0; i < cantidad; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.cssText = `
        left:               ${Math.random() * 100}%;
        top:                ${Math.random() * 100}%;
        width:              ${2 + Math.random() * 3}px;
        height:             ${2 + Math.random() * 3}px;
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay:    ${Math.random() * 5}s;
      `;
      starsEl.appendChild(s);
    }
  }

});

/* ════════════════════════════════════════
   SPLASH DE ESTRELLITAS al click del sobre
════════════════════════════════════════ */
function irAInvitacion() {

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #1a0030;
    z-index: 10000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;   /* ✏️ velocidad del fundido */
  `;
  document.body.appendChild(overlay);

  const colores = [
    '#ffffff', '#f0d8ff', '#e0b8ff',
    '#ffd6f0', '#ffe066', '#c8a0ff',
    '#ffb3e6', '#d4a0ff', '#fff0a0',
    '#ff99cc', '#b388ff', '#fffde0'
  ];

  const cx = canvas.width  / 2;
  const cy = canvas.height / 2;
  const particulas = [];

  /* ✏️ 200 = cantidad — no subas de 220 para evitar lag */
  for (let i = 0; i < 200; i++) {
    const angulo    = Math.random() * Math.PI * 2;
    const velocidad = 4 + Math.random() * 18;
    const radio     = 2 + Math.random() * 8;
    particulas.push({
      x: cx, y: cy,
      vx: Math.cos(angulo) * velocidad,
      vy: Math.sin(angulo) * velocidad,
      radio,
      color:    colores[Math.floor(Math.random() * colores.length)],
      alpha:    1,
      fade:     0.008 + Math.random() * 0.012,
      forma:    Math.random() > 0.35 ? 'estrella' : 'circulo',
      puntas:   Math.random() > 0.5 ? 5 : 4,
      rotacion: Math.random() * Math.PI * 2,
      giro:     (Math.random() - 0.5) * 0.12,
    });
  }

  function dibujarEstrella(ctx, x, y, puntas, r, rotacion) {
    const interno = r * 0.42;
    ctx.beginPath();
    for (let i = 0; i < puntas * 2; i++) {
      const ang  = rotacion + (i * Math.PI) / puntas;
      const dist = i % 2 === 0 ? r : interno;
      i === 0
        ? ctx.moveTo(x + Math.cos(ang) * dist, y + Math.sin(ang) * dist)
        : ctx.lineTo(x + Math.cos(ang) * dist, y + Math.sin(ang) * dist);
    }
    ctx.closePath();
    ctx.fill();
  }

  let fundidoIniciado = false;
  let redirigido      = false;

  function animar() {
    /* fondo semitransparente en vez de clearRect
       deja estela leve sin costar shadowBlur      */
    ctx.fillStyle = 'rgba(26,0,48,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let vivas = 0;

    particulas.forEach(p => {
      if (p.alpha <= 0) return;
      vivas++;
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.2;
      p.vx *= 0.99;
      p.alpha -= p.fade;
      p.rotacion += p.giro;

      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle   = p.color;
      /* ← shadowBlur ELIMINADO, era el culpable del lag */

      if (p.forma === 'estrella') {
        dibujarEstrella(ctx, p.x, p.y, p.puntas, p.radio, p.rotacion);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;

    /* Fundido inicia cuando quedan 65% vivas
       — más temprano, justo cuando están saliendo todas */
    if (!fundidoIniciado && vivas < particulas.length * 0.65) {
      fundidoIniciado = true;
      overlay.style.opacity = '1';

      /* ✏️ 750ms — debe ser >= duración transition (0.7s=700ms) */
      setTimeout(() => {
        redirigido = true;
        window.location.href = 'invitacion.html';
      }, 750);
    }

    if (!redirigido) requestAnimationFrame(animar);
  }

  animar();
}

function toggleCorazon(btn) {
  const audio = document.getElementById('audioInv');
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}
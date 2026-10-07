/* Independent, manual carousel. No autoplay or external dependencies. */
(function () {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const dots = [...hero.querySelectorAll('[data-hero]')];
  const status = hero.querySelector('#hero-status');
  let active = 0;
  let promotionTimer;
  hero.classList.add('is-enhanced');
  slides.forEach((slide, index) => {
    slide.hidden = false;
    slide.id = `hero-slide-${index + 1}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
    slide.setAttribute('aria-label', `${index + 1} de ${slides.length}`);
    dots[index].setAttribute('aria-controls', slide.id);
  });
  function show(index, announce = true) {
    const previous = active;
    active = (index + slides.length) % slides.length;
    clearTimeout(promotionTimer);
    slides.forEach(slide => {
      slide.style.willChange = 'auto';
      slide.querySelector('img').style.willChange = 'auto';
    });
    if (announce && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      [slides[previous], slides[active]].forEach(slide => {
        slide.style.willChange = 'opacity';
        slide.querySelector('img').style.willChange = 'transform';
      });
      promotionTimer = setTimeout(() => slides.forEach(slide => {
        slide.style.willChange = 'auto';
        slide.querySelector('img').style.willChange = 'auto';
      }), 1100);
    }
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.inert = !selected;
      slide.setAttribute('aria-hidden', String(!selected));
      dots[i].setAttribute('aria-pressed', String(selected));
    });
    if (announce) status.textContent = `Diapositiva ${active + 1} de ${slides.length}`;
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  hero.querySelectorAll('[data-hero-move]').forEach(button => {
    button.addEventListener('click', () => show(active + Number(button.dataset.heroMove)));
  });
  hero.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1);
    show(next);
    dots[active].focus();
  });
  show(0, false);
})();

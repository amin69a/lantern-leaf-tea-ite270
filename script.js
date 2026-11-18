'use strict';
/* ITE 270 starter STEP 5–9. JS decides WHEN; CSS decides appearance. */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const pauseBtn = $('#pauseBtn'), reduceBtn = $('#reduceBtn');
  let manualReduced = false, paused = false, count = 0, total = 0;
  const running = new Set(), order = new Map();
  const reduced = () => preference.matches || manualReduced;
  const instant = () => reduced() || paused;
  const curves = getComputedStyle(root);
  const travel = curves.getPropertyValue('--ease-travel').trim();
  const soft = curves.getPropertyValue('--ease-soft').trim();
  const toast = $('#toast');
  let toastTimer;
  function announce(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
  }
  // STEP 5 / R4: set up the observer BEFORE hiding anything. Fail open.
  const reveals = $$('.reveal');
  let revealIO;
  function showAll() { reveals.forEach(el => el.classList.remove('pending')); revealIO?.disconnect(); }
  if ('IntersectionObserver' in window && !instant()) {
    try {
      revealIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.remove('pending'); revealIO.unobserve(entry.target); }
        });
      }, { threshold: .2 });
      reveals.forEach(el => {
        revealIO.observe(el);
        if (el.getBoundingClientRect().top > innerHeight) el.classList.add('pending');
      });
    } catch (_) { showAll(); }
  }
  // A keyboard jump into a waiting card must never leave focused content hidden.
  reveals.forEach(el => el.addEventListener('focusin', () => { el.classList.remove('pending'); revealIO?.unobserve(el); }));

  // STEP 6 / R5: a centered observer band works in either scroll direction.
  const stage = $('#stage'), steps = $$('.step');
  const labels = {brew:'Brew the tea.', pearls:'Add the pearls.', milk:'Pour the milk.'};
  const numbers = {brew:'01 / TEA', pearls:'02 / PEARLS', milk:'03 / MILK'};
  const STORY_MARGIN = '-45% 0px -45% 0px';
  let storyIO;
  function selectStep(step) {
    stage.dataset.step = step;
    $('#stageLabel').textContent = labels[step];
    $('#stageNumber').textContent = numbers[step];
  }
  function syncStory() {
    storyIO?.disconnect();
    if (reduced() || !('IntersectionObserver' in window)) {
      stage.removeAttribute('data-step');
      $('#stageLabel').textContent = 'Tea, pearls, milk. Better together.';
      $('#stageNumber').textContent = '01—03';
      return;
    }
    // Pick the latest step whose top passed the center; handles reload mid-page.
    const current = steps.filter(el => el.getBoundingClientRect().top <= innerHeight * .55).at(-1) || steps[0];
    selectStep(current.dataset.step);
    storyIO = new IntersectionObserver(entries => {
      const active = entries.filter(e => e.isIntersecting).sort((a,b) => Math.abs(a.boundingClientRect.top-innerHeight*.5)-Math.abs(b.boundingClientRect.top-innerHeight*.5))[0];
      if (active) selectStep(active.target.dataset.step);
    }, { rootMargin: STORY_MARGIN, threshold: 0 });
    steps.forEach(step => storyIO.observe(step));
  }
  syncStory();
  // Both scripts use defer, so the starter's X-ray is ready at DOMContentLoaded.
  document.addEventListener('DOMContentLoaded', () => window.motionXray?.zone(STORY_MARGIN));

  // STEP 7 / R6: record order once, then chain flight -> badge via .finished.
  async function animateTracked(element, frames, options) {
    const animation = element.animate(frames, options);
    running.add(animation);
    try { await animation.finished; } finally { running.delete(animation); }
  }
  function updateOrder(card) {
    const name = card.dataset.name, price = Number(card.dataset.price);
    count++; total += price;
    order.set(name, (order.get(name) || 0) + 1);
    $('#count').hidden = false; $('#count').textContent = count;
    $('#cart').setAttribute('aria-label', `Your order, ${count} ${count === 1 ? 'drink' : 'drinks'}`);
    $('#emptyOrder').hidden = true;
    $('#orderItems').replaceChildren(...[...order].map(([item, qty]) => {
      const li = document.createElement('li'); li.textContent = `${qty} × ${item}`; return li;
    }));
    $('#orderTotal').textContent = `Total: $${total.toFixed(2)}`;
    announce(`${name} added. ${count} ${count === 1 ? 'drink' : 'drinks'} in your order.`);
  }
  $$('.add').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', async () => {
      const card = button.closest('.card');
      updateOrder(card);
      if (instant() || !Element.prototype.animate) return;
      const art = $('.art', card), from = $('svg', art).getBoundingClientRect(), to = $('#cart').getBoundingClientRect();
      const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ghost.setAttribute('viewBox','0 0 180 220'); ghost.setAttribute('aria-hidden','true'); ghost.classList.add('flying-drink');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use'); use.setAttribute('href','#drink'); ghost.append(use);
      const color = getComputedStyle(art);
      ['--tea','--milk','--pearl'].forEach(p => ghost.style.setProperty(p,color.getPropertyValue(p)));
      const x = from.left + from.width/2 - 26, y = from.top + from.height/2 - 32;
      ghost.style.left = `${x}px`; ghost.style.top = `${y}px`; document.body.append(ghost);
      const dx = to.left+to.width/2-(x+26), dy = to.top+to.height/2-(y+32);
      try {
        await animateTracked(ghost, [
          {transform:'translate(0,0) scale(1)',opacity:1},
          {transform:`translate(${dx*.5}px,${dy*.5-45}px) scale(.72)`,opacity:1,offset:.5},
          {transform:`translate(${dx}px,${dy}px) scale(.18)`,opacity:0}
        ], {duration:450,easing:travel});
        ghost.remove();
        if (!instant()) await animateTracked($('#count'), [
          {transform:'scale(1)'},{transform:'scale(1.15)',offset:.45},{transform:'scale(1)'}
        ], {duration:180,easing:soft});
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Order feedback:',error);
      } finally { ghost.remove(); }
    });
  });
  // The bag is a real demo summary, not a dead button.
  const cart = $('#cart'), panel = $('#orderPanel');
  cart.disabled = false;
  function closeOrder() { panel.hidden = true; cart.setAttribute('aria-expanded','false'); }
  cart.addEventListener('click', () => { panel.hidden = !panel.hidden; cart.setAttribute('aria-expanded',String(!panel.hidden)); });
  $('#closeOrder').addEventListener('click', () => { closeOrder(); cart.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { closeOrder(); cart.focus(); } });
  document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target) && !cart.contains(e.target)) closeOrder(); });

  // STEP 9 / R8: pause loops AND active WAAPI animations. New orders stay usable.
  pauseBtn.disabled = false;
  pauseBtn.addEventListener('click', () => {
    paused = !paused; root.classList.toggle('paused',paused);
    pauseBtn.setAttribute('aria-pressed',String(paused));
    pauseBtn.textContent = paused ? 'Play motion' : 'Pause motion';
    running.forEach(a => paused ? a.pause() : a.play());
    if (paused) showAll();
  });
  function syncReduced() {
    root.classList.toggle('reduced', reduced());
    reduceBtn.setAttribute('aria-pressed',String(reduced()));
    reduceBtn.textContent = reduced() ? 'Reduced motion on' : 'Use reduced motion';
    $('#motionState').textContent = preference.matches ? 'Device preference: reduced motion.' : manualReduced ? 'Reduced motion selected on this page.' : 'Motion follows your device preference.';
    if (reduced()) { showAll(); running.forEach(a => a.cancel()); }
    syncStory();
  }
  preference.addEventListener('change',syncReduced);
  reduceBtn.disabled = false;
  reduceBtn.addEventListener('click', () => {
    // An in-page switch never overrides a device request for less motion.
    if (preference.matches) { announce('Reduced motion is enabled by your device preference.'); return; }
    manualReduced = !manualReduced; syncReduced();
  });
  const replay = $('#replayBtn'); replay.disabled = false;
  replay.addEventListener('click', () => {
    if (instant()) { announce('Headline is visible. Motion is paused or reduced.'); return; }
    $$('.hero .w').forEach(word => word.getAnimations().forEach(a => { a.currentTime = 0; a.play(); }));
  });
  syncReduced();
})();

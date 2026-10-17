'use strict';
const nav = document.querySelector('.desktop-nav');
const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
function closeMenu() { menu?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-label','Open navigation'); nav?.classList.remove('is-open'); }
nav?.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') {closeMenu(); if(document.activeElement?.closest('.desktop-nav')) menu.focus();} });
document.addEventListener('click', e => { if(!e.target.closest('.site-header')) closeMenu(); });
const filters = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('.publication-row')];
const search = document.querySelector('#paper-search');
const count = document.querySelector('#paper-count');
const empty = document.querySelector('#empty-papers');
let activeFilter = 'all';
function filterPapers() {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  for(const paper of papers) {
    const match = (activeFilter === 'all' || paper.dataset.status === activeFilter) && paper.textContent.toLocaleLowerCase().includes(query);
    paper.hidden = !match;
    if(match) visible++;
  }
  count.textContent = `${visible} ${visible===1?'paper':'papers'}${query ? ' matching your search' : ''}`;
  empty.hidden = visible > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filters.forEach(b => b.setAttribute('aria-pressed',String(b===button)));
  filterPapers();
}));
search?.addEventListener('input', filterPapers);

const figureDialog = document.querySelector('#paper-figure-dialog');
const figureImage = document.querySelector('#figure-dialog-image');
const figureTitle = document.querySelector('#figure-dialog-title');
const figureCaption = document.querySelector('#figure-dialog-caption');
const figureLabel = document.querySelector('#figure-dialog-label');
const figureSource = document.querySelector('#figure-dialog-source');
let figureTrigger = null;
document.querySelectorAll('button.paper-figure').forEach(button => {
  button.addEventListener('click', () => {
    if (!figureDialog || typeof figureDialog.showModal !== 'function') return;
    figureTrigger = button;
    figureImage.src = button.dataset.figureSrc;
    figureImage.alt = button.dataset.figureAlt || '';
    figureTitle.textContent = button.dataset.figureTitle;
    figureCaption.textContent = button.dataset.figureCaption || '';
    figureCaption.hidden = !figureCaption.textContent;
    figureLabel.textContent = button.dataset.figureLabel || '';
    figureLabel.hidden = !figureLabel.textContent;
    const source = button.dataset.figureSource;
    figureSource.hidden = !source;
    if (source) figureSource.href = source;
    else figureSource.removeAttribute('href');
    figureDialog.showModal();
    document.body.classList.add('figure-view-open');
  });
});
figureDialog?.querySelector('.figure-dialog-close')?.addEventListener('click', () => figureDialog.close());
figureDialog?.addEventListener('click', event => {
  if (event.target !== figureDialog) return;
  const bounds = figureDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) figureDialog.close();
});
figureDialog?.addEventListener('close', () => {
  document.body.classList.remove('figure-view-open');
  figureTrigger?.focus({preventScroll:true});
});

const links = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let scrollPending = false;
function updateNavigation() {
  let active = sections[0];
  for(const section of sections) if(section.getBoundingClientRect().top <= 160) active=section;
  links.forEach(link => {
    const selected=link.getAttribute('href') === `#${active.id}`;
    link.classList.toggle('active', selected);
    if(selected) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
  scrollPending=false;
}
window.addEventListener('scroll', () => { if(!scrollPending){scrollPending=true; requestAnimationFrame(updateNavigation);} }, {passive:true});
updateNavigation();
document.querySelector('.copy-email')?.addEventListener('click', async () => {
  const feedback = document.querySelector('.copy-feedback');
  try { await navigator.clipboard.writeText('sun1321@purdue.edu'); feedback.textContent='Email address copied.'; }
  catch { feedback.textContent='sun1321@purdue.edu'; }
});

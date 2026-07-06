// Hamburger menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
// Zavřít menu po kliku na kotvu
nav.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Validace formuláře
const form = document.getElementById('lead-form');
const fields = {
  name:  { test: (v) => v.trim().length >= 3, msg: 'Vyplňte prosím jméno a příjmení.' },
  email: { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Zadejte platný e-mail.' },
  phone: { test: (v) => /^[+\d][\d\s]{8,}$/.test(v.trim()), msg: 'Zadejte platné telefonní číslo.' },
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  for (const [id, { test, msg }] of Object.entries(fields)) {
    const input = form.elements[id];
    const error = input.closest('.form-field').querySelector('.form-error');
    const ok = test(input.value);
    error.textContent = ok ? '' : msg;
    input.classList.toggle('is-invalid', !ok);
    if (!ok) valid = false;
  }
  if (valid) {
    form.hidden = true;
    document.querySelector('.form-success').hidden = false;
  }
});

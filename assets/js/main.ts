interface Window {
  onContactFormSubmit: Function;
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const header = document.getElementsByTagName('header')[0];
    const mastheadHomepage = document.getElementById('masthead-homepage');

    window.addEventListener('scroll', () => {
      if (mastheadHomepage) {
        mastheadHomepage.style.opacity = String(
          1 - window.scrollY / (window.innerHeight / 2)
        );
        mastheadHomepage.style.marginTop = -window.scrollY / 2 + 'px';
      }

      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    setupFlyoutMenu();
  },
  false
);

function setupFlyoutMenu() {
  document.getElementById('nav-icon')?.addEventListener('click', (e) => {
    document.getElementById('nav-icon')?.classList.toggle('open');
    document.getElementById('flyout')?.classList.toggle('open');
  });
}

window.onContactFormSubmit = function () {
  const form = document.getElementById('contact-form') as HTMLFormElement;
  form.submit();
  form.reset();

  const submitResponseEl = document.getElementById(
    'contact-form-submit-response'
  );

  submitResponseEl?.classList.add('reveal');

  setTimeout(() => {
    submitResponseEl?.classList.remove('reveal');
  }, 2000);
};

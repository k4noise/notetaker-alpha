const signInButton = document.querySelector('.navigation__button-sign-in'),
  registrationButton = document.querySelectors(
    '.navigation__button-registration'
  );

signInButton.addEventListener('click', () => {
  document.querySelector('.signin').style.display = 'flex';
});

registrationButton.addEventListener('click', () => {
  document.querySelector('.register').style.display = 'flex';
});

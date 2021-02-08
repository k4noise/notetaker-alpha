const signInButton = document.querySelector('.navigation__button-sign-in'),
  registrationButton = document.querySelector(
    '.navigation__button-registration'
  ),
  endRegisterButton = document.querySelector('.register__send');

signInButton.addEventListener('click', () => {
  document.querySelector('.signin').style.display = 'flex';
});

registrationButton.addEventListener('click', () => {
  document.querySelector('.register').style.display = 'flex';
});

document.querySelector('.register').addEventListener('submit', (e) => {
  e.preventDefault();
});

endRegisterButton.addEventListener('click', async () => {
  const form = document.forms.register;
  const result = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      login: form.elements.register_login.value,
      password: form.elements.register_password.value,
    }),
  });
  if (result.code !== 202) {
    form.innerHTML += result.message;
  }
});

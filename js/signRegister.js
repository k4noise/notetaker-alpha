const signInButton = document.querySelector('.navigation__button-sign-in'),
  registerButton = document.querySelector('.navigation__button-registration'),
  endRegisterButton = document.querySelector('.register__send'),
  signInForm = document.forms.signIn,
  registerForm = document.forms.register;

signInButton.addEventListener('click', () => {
  signInForm.style.display = 'flex';
});

registerButton.addEventListener('click', () => {
  registerForm.style.display = 'flex';
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

endRegisterButton.addEventListener('click', async () => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      login: registerForm.elements.register_login.value,
      password: registerForm.elements.register_password.value,
    }),
  });
  const result = await response.json();
  if (result.code !== 202) {
    registerForm.innerHTML += result.message;
  }
});

registerButton.addEventListener('click', async () => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      login: signInForm.elements.signin_login.value,
      password: signInForm.elements.signin_password.value,
    }),
  });
  const result = await response.json();
  if (result.code !== 202) {
    signInForm.innerHTML += result.message;
  }
});

const signInButton = document.querySelector('.navigation__button-sign-in'),
  registerButton = document.querySelector('.navigation__button-registration'),
  endRegisterButton = document.querySelector('.register__send'),
  signInForm = document.forms.signin,
  registerForm = document.forms.register,
  closeSignInForm = document.querySelector('.signin__close'),
  closeRegisterForm = document.querySelector('.register__close');

const closeForm = (e) => {
  e.target.closest('form').style.display = 'none';
};

closeSignInForm.addEventListener('click', closeForm);
closeRegisterForm.addEventListener('click', closeForm);

signInButton.addEventListener('click', () => {
  signInForm.style.display = 'flex';
});

registerButton.addEventListener('click', () => {
  registerForm.style.display = 'flex';
});

signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
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
    document.querySelector('.signin__notice').innerHTML =
      result.message || 'Успешно!';
  }
});
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
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
  if (result.code === 200) {
    fetch('/api/login', {
      method: 'POST',
    });
  } else {
    document.querySelector('.register__notice').innerHTML = result.message;
  }
});

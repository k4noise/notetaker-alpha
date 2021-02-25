const signInButton = document.querySelector('.navigation__button-sign-in'),
  registerButton = document.querySelector('.navigation__button-registration'),
  logOutButton = document.querySelector('.navigation__logout'),
  signInForm = document.forms.signin,
  registerForm = document.forms.register,
  closeSignInForm = document.querySelector('.signin__close'),
  closeRegisterForm = document.querySelector('.register__close');

const closeForm = (event) => {
  event.target.closest('form').style.display = 'none';
};

const changeControls = () => {
  signInButton.style.display = 'none';
  registerButton.style.display = 'none';
  logOutButton.style.display = 'block';
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
  if (result.code !== 200) {
    document.querySelector('.signin__notice').innerHTML =
      result.message || 'Успешно!';
  } else {
    setTimeout(() => {
      signInForm.style.display = 'none';
      changeControls();
      document.querySelector('.navigation__login').innerHTML =
        signInForm.elements.signin_login.value;
        window.location.reload();
    }, 500);
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const login = registerForm.elements.register_login.value,
    password = registerForm.elements.register_password.value;
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });
  const result = await response.json();
  if (result.code === 200) {
    const a = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
      }),
    });
    const b = await a.json();
    setTimeout(() => {
      registerForm.style.display = 'none';
      changeControls();
      window.location.reload();
      document.querySelector('.navigation__login').innerHTML = b.login;
      if (b.code !== 200) {
        alert('Повторите попытку входа еще раз');
      }
    }, 500);
  } else {
    document.querySelector('.register__notice').innerHTML = result.message;
  }
});

logOutButton.addEventListener('click', () => {
  fetch('/api/logout');
  window.location.reload();
});

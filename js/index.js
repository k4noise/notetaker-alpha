const textColorVariable = '--main-text-color',
  backgroundColorVariable = '--main-background-color',
  themeChangerButton = document.querySelector('.theme-changer'),
  menuShowIcon = document.querySelector('.menu'),
  navigation = document.querySelector('.navigation'),
  root = document.documentElement;

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.info('Service Worker registered successfully.');
      })
      .catch((error) => {
        throw new Error('Service Worker registration failed:', error);
      });
  }
};

// Используется для того, чтобы фон при загрузке страницы не анимировался, а анимировался только при изменении
setTimeout(() => {
  document.body.classList.add('animate');
}, 200);

/**
 * Используется для скрытия и отображения навигации
 * navigation - index.html
 * controlsNavigation - app.html
 * @returns {void}
 */
const toggleNavigation = () => {
  navigation.style.display =
  navigation.style.display === 'flex' ? 'none' : 'flex';
};

menuShowIcon.addEventListener('click', toggleNavigation);

/**
 * Читает данные из localStorage и при их наличии задает цвет фону и тексту
 * @param {string} textColorVariable Имя переменной (включая два дефиса), обозначающей цвет текста в CSS
 * @param {string} backgroundColorVariable Имя переменной (включая два дефиса), обозначающей цвет фона в CSS
 * @returns {void}
 */
const setTheme = (textColorVariable, backgroundColorVariable) => {
  const textColor = localStorage.getItem('textColor'),
  backgroundColor = localStorage.getItem('backgroundColor');
  if (textColor && backgroundColor) {
    root.style.setProperty(textColorVariable, textColor);
    root.style.setProperty(backgroundColorVariable, backgroundColor);
  }
};

/**
 * Изменяет глобальную тему приложения
 * @param {string} textColorVariable Имя переменной (включая два дефиса), обозначающей цвет текста в CSS
 * @param {string} backgroundColorVariable Имя переменной (включая два дефиса), обозначающей цвет фона в CSS
 * @returns {void}
 */
const changeTheme = (textColorVariable, backgroundColorVariable) => {
  let textColor = getComputedStyle(document.documentElement)
  .getPropertyValue(textColorVariable)
  .trim(),
  backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue(backgroundColorVariable)
  .trim();
  [textColor, backgroundColor] = [backgroundColor, textColor];
  root.style.setProperty(textColorVariable, textColor);
  root.style.setProperty(backgroundColorVariable, backgroundColor);
  localStorage.setItem('textColor', textColor);
  localStorage.setItem('backgroundColor', backgroundColor);
  themeChangerButton.blur();
};

setTheme(textColorVariable, backgroundColorVariable);

themeChangerButton.addEventListener('click', () =>
changeTheme(textColorVariable, backgroundColorVariable)
);
registerServiceWorker();

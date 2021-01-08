'use strict';
let lastOpenedAccordeon = null;
const accordeonElements = document.querySelectorAll('.faq__answer');

accordeonElements.forEach((accordeonElement) =>
  accordeonElement.addEventListener('click', (event) => checkAccordeon(event))
);

/**
 * Проверяет, есть ли открытый элемент аккордеона, при его наличии - закрывает
 * @param {object} event Объект события onclick
 * @returns {void}
 */
const checkAccordeon = (event) => {
  if (event.target !== lastOpenedAccordeon && lastOpenedAccordeon) {
    lastOpenedAccordeon.parentElement.removeAttribute('open');
  }
  lastOpenedAccordeon = event.target;
};

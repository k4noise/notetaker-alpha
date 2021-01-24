/**
 * Проверяет объект на наличие всех свойств, указанных в properties
 * @param {object} obj Проверяемый объект
 * @param {array} properties Проверяемые свойства
 * @returns {bool} Наличие всех свойств в объекте
 */
const isValidObject = (obj, properties) => {
  let valid = true;
  properties.forEach((property) => {
    if (!obj[property]) {
      valid = false;
    }
  });
  return valid;
};

module.exports = isValidObject;

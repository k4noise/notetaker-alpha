/**
 * Проверяет объект на наличие всех свойств, указанных в properties
 * @param {object} obj Проверяемый объект
 * @param {array} properties Проверяемые свойства
 * @returns {bool} Наличие всех свойств в объекте и ошибки при их наличии
 */
const isValidObject = (obj, properties) => {
  let isValid = true;
  const errors = {};
  properties.forEach((property) => {
    if (!obj[property]) {
      isValid = false;
      errors[property] = `Field ${property} can not be blank`;
    }
  });
  return { isValid, errors };
};

module.exports = isValidObject;

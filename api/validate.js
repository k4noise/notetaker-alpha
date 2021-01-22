const validate = (obj, properties) => {
  let valid = true;
  properties.foreach((property) => {
    if (!obj[property]) {
      valid = false;
    }
  });
  return valid;
};
module.exports = validate;

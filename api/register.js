/**
 * Генерирует токен
 * @returns {string} Токен
 */
const generateToken = () => {
  const tokenPart = () => Math.random().toString(16).slice(3, 7);
  return `${tokenPart()}-${tokenPart()}-${tokenPart()}-${tokenPart()}`;
};

/**
 * Заносит в базу данных пользователя
 * @param {object} body Данные о пользователе
 * @returns {object} Тело-ответ
 */
const register = async (body) => {
  const valid = isValidObject(body, ['password', 'login']);
  const result = {};
  result.body = {};
  const userAuthData = await api.searchUser(body.login);
  if (valid.isValid && !userAuthData) {
    const password = body.password;
    const readyPassword = bcrypt.hashSync(password, salt);
    const token = generateToken();
    await api.db.query('insert into users values($1, $2, $3)', [
      body.login,
      readyPassword,
      token,
    ]);
    result.status = 200;
    result.body.code = 200;
    result.body.message = 'Регистрация прошла успешно!';
  } else if (!valid.isValid) {
    result.status = 422;
    result.body.code = 422;
    result.body.message = 'Ошибка валидации';
    result.body.errors = valid.errors;
  } else {
    result.status = 409;
    result.body.code = 409;
    result.body.message = 'Пользователь существует';
  }
  result.body = JSON.stringify(result.body);
  return result;
};

module.exports = register;

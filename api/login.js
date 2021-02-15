/**
 * Сверяет логин и пароль с базой данных
 * @param {object} body Данные о пальзователе
 * @returns {object} Тело-ответ
 */
const login = async (body) => {
  const valid = isValidObject(body, ['password', 'login']);
  const result = {};
  if (valid.isValid) {
    const userAuthData = await api.searchUser(body.login);
    if (userAuthData) {
      if (
        userAuthData.password ===
        bcrypt.hashSync(body.password, process.env.salt)
      ) {
        result.status = 200;
        result.token = userAuthData.token;
        result.body = {};
        result.body.code = 200;
        result.body.token = userAuthData.token;
      } else {
        result.status = 401;
        result.body = {};
        result.body.code = 401;
        result.body.message = 'Incorrect password';
      }
    } else {
      result.status = 404;
      result.body = {};
      result.body.code = 404;
      result.body.message = 'User not exist';
    }
  } else {
    if (body.headers.cookie) {
      const token = body.headers.cookie.split('=')[1];
      const userAuthData = await api.searchUser(token);
      if (userAuthData) {
        result.status = 200;
        result.token = userAuthData.token;
        result.body = {};
        result.body.code = 200;
        result.body.login = userAuthData.login;
        result.body.token = userAuthData.token;
      }
    } else {
      result.status = 422;
      result.body = {};
      result.body.code = 422;
      result.body.message = 'Ошибка валидации';
      result.body.errors = valid.errors;
    }
  }
  result.body = JSON.stringify(result.body);
  return result;
};

module.exports = login;

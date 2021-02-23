/**
 * Сверяет логин и пароль с базой данных
 * @param {object} body Данные о пальзователе
 * @returns {object} Тело-ответ
 */
const login = async (body) => {
  const valid = isValidObject(body, ['password', 'login']);
  const result = {};
  result.body = {};
  if (valid.isValid) {
    const userAuthData = await api.searchUser(body.login);
    if (userAuthData) {
      if (
        userAuthData.password ===
        bcrypt.hashSync(body.password, process.env.salt)
      ) {
        const expireCookieDate = new Date();
        expireCookieDate.setDate(expireCookieDate.getDate() + 14);
        result.status = 200;
        result.token = userAuthData.token;
        result.header = `token=${
          result.token
        };Expires=${expireCookieDate.toUTCString()}; Path=/; HttpOnly`;
        result.body.code = 200;
        result.body.token = userAuthData.token;
      } else {
        result.status = 401;
        result.body.code = 401;
        result.body.message = 'Incorrect password';
      }
    } else {
      result.status = 404;
      result.body.code = 404;
      result.body.message = 'User not exist';
    }
  } else {
    if (body.hasOwnProperty('cookie')) {
      const token = body.cookie;
      const userAuthData = await api.searchUser(token);
      if (userAuthData) {
        result.status = 200;
        result.token = userAuthData.token;
        result.body.code = 200;
        result.body.login = userAuthData.login;
        result.body.token = userAuthData.token;
      }
    } else {
      result.status = 422;
      result.body.code = 422;
      result.body.message = 'Ошибка валидации';
      result.body.errors = valid.errors;
    }
  }
  result.body = JSON.stringify(result.body);
  return result;
};

module.exports = login;

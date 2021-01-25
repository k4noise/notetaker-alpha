const generateToken = () => {
  const tokenPart = () => Math.random().toString(16).slice(3, 7);
  return `${tokenPart()}-${tokenPart()}-${tokenPart()}-${tokenPart()}`;
};

const register = async (body) => {
  const valid = mod.isValidObject(body, ['password', 'login']);
  const result = {};
  result.body = {};
  const userAuthData = await api.searchUser(body.login);
  if (valid && !userAuthData) {
    const password = body.password;
    const readyPassword = mod.bcrypt.hashSync(password, salt);
    const token = generateToken();
    await api.db.query('insert into users values($1, $2, $3)', [
      body.login,
      readyPassword,
      token,
    ]);
    result.status = 202;
    result.body.code = 202;
    result.body.token = token;
  } else if (!valid) {
    result.status = 422;
    result.body.code = 422;
    result.body.message = 'Validation error';
    if (!body.password) {
      result.body.password = 'Field password can not be blank';
    }
    if (!body.login) {
      result.body.login = 'Field login can not be blank';
    }
  } else {
    result.status = 403;
    result.body.code = 403;
    result.body.message = 'User exists';
  }

  return result;
};

module.exports = register;

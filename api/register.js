const generateToken = () => {
  const tokenPart = () => Math.random().toString(16).slice(3, 7);
  return `${tokenPart()}-${tokenPart()}-${tokenPart()}-${tokenPart()}`;
};

const register = async (body) => {
  const result = {};
  if (body.password && body.login) {
    const password = body.password;
    const readyPassword = mod.bcrypt.hashSync(password, salt);
    const token = generateToken();
    await api.db.query('insert into users values($1, $2, $3)', [
      body.login,
      readyPassword,
      token
    ]);
    result.status = 204;
  } else {
    result.status = 422;
    result.body = {};
    result.body.error = {};
    result.body.error.code = 422;
    result.body.error.message = 'Validation error';
    result.body.error.errors = {};
    if (!body.password) {
      result.body.error.errors.password = 'Field password can not be blank';
    }
    if (!body.login) {
      result.body.error.errors.login = 'Field login can not be blank';
    }
  }

  return result;
};

module.exports = register;

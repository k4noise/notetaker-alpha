const login = async (body) => {
  const valid = mod.isValidObject(body, ['password', 'login']);
  const result = {};
  if (valid) {
    const userAuthData = await api.searchUser(body.login);
    if (userAuthData) {
      if (
        userAuthData.password ===
        mod.bcrypt.hashSync(body.password, process.env.salt)
      ) {
        result.status = 200;
        result.body = {};
        result.body.token = userAuthData.token;
      } else {
        result.status = 401;
        result.body = {};
        result.body.code = 401;
        result.body.message = 'Incorrect password';
      }
    } else {
      result.status = 422;
      result.body = {};
      result.body.code = 422;
      result.body.message = 'Validation error';
      if (!body.password) {
        result.body.password = 'Field password can not be blank';
      }
      if (!body.login) {
        result.body.login = 'Field login can not be blank';
      }
    }
  } else {
    result.status = 422;
    result.body = {};
    result.body.code = 422;
    result.body.message = 'Validation error';
    if (!body.password) {
      result.body.password = 'Field password can not be blank';
    }
    if (!body.login) {
      result.body.login = 'Field login can not be blank';
    }
  }
  return result;
};

module.exports = login;

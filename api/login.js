const login = async (body) => {
  const result = {};
  if (body.password && body.login) {
    const userAuthData = await api.db.query(
      'select * from users where login = $1',
      [body.login]
    );
    if (
      userAuthData.rows[0].password ===
      mod.bcrypt.hashSync(body.password, process.env.salt)
    ) {
      result.status = 200;
      result.body = {};
      result.body.token = userAuthData.rows[0].token;
    } else {
      result.status = 401;
      result.body = {};
      result.body.error = {};
      result.body.error.code = 401;
      result.body.error.message = "Unauthorized";
      result.body.error.errors = {};
      result.body.error.errors.password = "Incorrect password"

    }
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
module.exports = login;

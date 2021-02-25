const createNote = async (body) => {
  const result = {};
  const user = await api.searchUser(body.cookieToken);
  const login = user.login;
  const valid = isValidObject(body, ['key', 'color', 'date', 'header', 'text']);
  if (valid) {
    api.db.query(
      `insert into ${login} (key, color, created_at, header, text) values ($1, $2, $3, $4, $5)`,
      [body.key, body.color, body.date, body.header, body.text]
    );
    result.status = 200;
  } else {
    result.status = 422;
    result.body.code = 422;
    result.body.message = 'Ошибка валидации';
    result.body.errors = valid.errors;
  }
  return result;
};

module.exports = createNote;

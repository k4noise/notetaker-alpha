/**
 * Выполняет добавление заметки в базу данных
 * @param {object} body Данные о заметках и пользователе
 * @returns {object} Тело-ответ
 */
const modifyNote = async (body) => {
  const result = {};
  const user = await api.searchUser(body.cookieToken);
  const login = user.login;
  result.body = {};
  const valid = isValidObject(body, ['key', 'color', 'date', 'header', 'text']);

  if (!valid.isValid) {
    result.status = 422;
    result.body.code = 422;
    result.body.message = 'Ошибка валидации';
    result.body.errors = valid.errors;
    return result;
  }

  const isExists = await api.db.query(
    `select * from ${login} where key = '${body.key}'`
  );
  if (isExists.rows[0]) {
    const editNoteQuery = `update ${login} set color = $1, header = $2, text = $3 where key = $4`;
    api.db.query(editNoteQuery, [body.color, body.header, body.text, body.key]);
  } else {
    return await api.createNote(body);
  }
  result.status = 204;
  result.body = JSON.stringify(result.body);
  return result;
};

module.exports = modifyNote;

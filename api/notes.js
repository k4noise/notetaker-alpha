/**
 * Читает заметки определенного пользователя по токену
 * @param {object} { token } Токен пользователя
 * @returns {any} Тело-ответ
 */
const notes = async (body) => {
  const token = body.headers.cookie.split('=')[1];
  const user = await api.searchUser(token);
  const result = {};
  result.body = {};
  if (token) {
    const userNotesTableQuery = `create table if not exists ${user.login}(
    key varchar(10),
    color varchar(7),
    created_at date,
    header varchar(50),
    text varchar(1024)
  )`;
    await api.db.query(userNotesTableQuery);
    const noteQuery = `select * from ${user.login}`;
    const note = await api.db.query(noteQuery);
    if (note.rowCount > 0) {
      result.status = 200;
      for (const noteObject of note.rows) {
        result.body[noteObject.key] = noteObject;
      }
    } else {
      result.status = 404;
      result.body.status = 404;
      result.body.message = 'Notes not found for current user';
    }
  } else {
    result.status = 401;
    result.body.status = 401;
    result.body.message = 'Unauthorized';
  }
  result.body = JSON.stringify(result.body);
  return result;
};

module.exports = notes;

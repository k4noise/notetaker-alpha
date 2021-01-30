const searchUser = require('./searchUser');

const notes = async ({ token }) => {
  const user = await searchUser(token);
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
      note.rows.forEach((note) => (result.body[note.key] = note));
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
  return result;
};

module.exports = notes;

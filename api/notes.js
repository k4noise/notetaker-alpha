const searchUser = require('./searchUser');

const notes = async ({ token }) => {
  const userLogin = searchUser(token).login;
  const result = {};
  result.body = {};
  const userNotesTableQuery = `create table if not exists ${userLogin}(
    key varchar(10),
    color varchar(7),
    created_at date,
    header varchar(50),
    text varchar(1024)
  )`;
  await api.db.query(userNotesTableQuery);
  const noteQuery = `select * from ${userLogin}`;
  const note = await api.db.query(noteQuery);
  if (note.rowCount > 0) {
    result.status = 200;
    note.forEach((note) => (result.body[note.key] = note));
  } else {
    result.status = 404;
    result.body.status = 404;
    result.body.message = 'Notes not found for current user';
  }
  return result;
};

module.exports = notes;

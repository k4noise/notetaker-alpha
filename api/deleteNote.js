const deleteNote = async (body) => {
  const result = {};
  const user = await api.searchUser(body.cookieToken);
  const login = user.login;
  const isExists = await api.db.query(
    `select * from ${login} where key = '${body.key}'`
  );
  if (isExists.rows[0]) {
    await api.db.query(`delete from ${login} where key = '${body.key}'`);
    result.status = 200;
  }
  return result;
};

module.exports = deleteNote;

/**
 * Выполняет поиск пользователя в базе данных
 * @param {string} login Логин пользователя
 * @returns {object} Объект данных пользователя или null
 */
const searchUser = async (login) => {
  const user = await api.db.query('select * from users where login = $1 or token = $1', [
    login,
  ]);
  return user ? user.rows[0] : null;
};

module.exports = searchUser;

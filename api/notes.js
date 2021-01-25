const notes = await (token) => {
  api.db.query(`create table if not exists $1(
    key varchar(10),
    color varchar(7),
    date varchar(22),
    header varchar(50),
    text varchar(1024)
  )`, [token]);
}

module.exports = notes;
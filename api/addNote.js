const addNotes = async (body) => {
  const result = {};
  result.body = {};
  const valid = mod.isValidObject(body, [
    'login',
    'key',
    'color',
    'date',
    'header',
    'text',
  ]);
  if (!valid) {
    result.status = 422;
    result.body.code = 422;
    result.body.message = 'Validation error';
    result.body.errors = {};
    if (!body.login) {
      result.body.errors.login = 'Field login can not be blank';
    }
    if (!body.key) {
      result.body.errors.key = 'Field key can not be blank';
    }
    if (!body.color) {
      result.body.errors.color = 'Field color can not be blank';
    }
    if (!body.date) {
      result.body.errors.date = 'Field date can not be blank';
    }
    if (!body.header) {
      result.body.errors.header = 'Field header can not be blank';
    }
    if (!body.text) {
      result.body.errors.text = 'Field text can not be blank';
    }
    return result;
  }
  const addNoteQuery = `insert into ${body.login} values (
    $1, $2, $3, $4, $5
  )`;
  api.db.query(addNoteQuery, [
    body.key,
    body.color,
    body.date,
    body.header,
    body.text,
  ]);
  result.status = 204;
  return result;
};

module.exports = addNotes;

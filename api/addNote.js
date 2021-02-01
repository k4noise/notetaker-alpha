const addNotes = async (body) => {
  const result = {};
  result.body = {};
  const valid = isValidObject(body, [
    'login',
    'key',
    'color',
    'date',
    'header',
    'text',
  ]);
  if (!valid.isValid) {
    result.status = 422;
    result.body.code = 422;
    result.body.message = 'Validation error';
    result.body.errors = valid.errors;
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

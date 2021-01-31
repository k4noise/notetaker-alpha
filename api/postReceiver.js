/**
 * Получает данные при методая отправки POST, PUT, DELETE, PATCH и прочих
 * @param {object} request Объект запроса
 * @returns {object} Содержит полученные данные и заголовки
 */
const postReceiver = async (request) => {
  let chunks = '';
  await request.on('data', (chunk) => {
    chunks += chunk.toString();
  });
  const body = JSON.parse(chunks);
  body.headers = request.headers;
  return body;
};

module.exports = postReceiver;

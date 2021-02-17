/**
 * Получает данные при методая отправки POST, PUT, DELETE, PATCH и прочих
 * @param {object} request Объект запроса
 * @returns {object} Содержит полученные данные и заголовки
 */
const dataReceiver = async (request) => {
  let chunks = '';
  await request.on('data', (chunk) => {
    if (chunk) {
    chunks += chunk.toString();
    }
  });
  const body = JSON.parse(chunks);
  body.headers = request.headers;
  return body || '';
};

module.exports = dataReceiver;

// const routing = {
//   '/api/register': api.register,
//   '/api/login': api.login,
//   '/api/notes': api.notes,
//   '/api/addNote': api.addNotes,
// };
const routing2 = {
  '*': staticFiles,
  '/': staticFiles('index.html'),
  '/index': staticFiles('index.html'),
  '/app': staticFiles('app.html'),
  '/api/register': api.register,
  '/api/login': api.login,
  '/api/notes': api.notes,
  '/api/addNote': api.addNotes,
};

// const shortUrl = { '/': 'index.html', '/app': 'app.html' };

// module.exports = { routing, shortUrl };

const router = async (body) => {
  let result = routing2[body.url] || routing2['*'](body.url);
  if (typeof result === 'function') {
    result = await result(body);
  }
  return result;
};

module.exports = router;

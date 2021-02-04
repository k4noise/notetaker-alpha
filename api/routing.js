const routes = {
  '*': staticFiles,
  '/api/register': api.register,
  '/api/login': api.login,
  '/api/notes': api.notes,
  '/api/addNote': api.addNotes,
};
const router = async (body) => {
  let result = routes[body.url] || routes['*'](body.url);
  if (typeof result === 'function') {
    result = await result(body);
  }
  return result;
};

routes['/'] = (async () => await router({ url: '/index.html' }))();
routes['/app'] = (async () => await router({ url: '/app.html' }))();

module.exports = router;

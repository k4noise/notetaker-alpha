const route = {};

const addRoute = (routeName, routeCallback, routeParams = null) => {
  route[routeName] = {
    callback: routeCallback,
    params: routeParams,
  };
};
const router = async (body) => {
  let callback, routeParams;
  if (route[body.url]) {
    callback = route[body.url].callback;
    routeParams = route[body.url].params;
  } else {
    callback = route['*'].callback;
    routeParams = body.url;
  }
  return await callback(routeParams || body);
};

addRoute('*', staticFiles);
addRoute('/api/register', api.register);
addRoute('/api/login', api.login);
addRoute('/api/logout', api.logout);
addRoute('/api/notes', api.notes);
addRoute('/api/addNote', api.modifyNote);
addRoute('/api/deleteNote', api.deleteNote);
addRoute('/api/createNote', api.createNote);
addRoute('/', staticFiles, '/index.html');
addRoute('/app', staticFiles, '/app.html');

module.exports = router;

require('dotenv').config();
global.salt = process.env.salt;

global.http = require('http');
global.fs = require('fs');
global.path = require('path');
global.staticFiles = require('./api/static');
global.postReceiver = require('./api/postReceiver');
global.isValidObject = require('./api/validate');
global.bcrypt = require('bcrypt');

global.api = {};
api.db = require('./api/database');
api.register = require('./api/register');
api.login = require('./api/login');
api.notes = require('./api/notes');
api.addNotes = require('./api/addNote');
// const { routing, shortUrl } = require('./api/routing');
// api.routing = routing;
// api.shortUrl = shortUrl;
api.searchUser = require('./api/searchUser');

global.router = require('./api/routing');

const requestHandler = async (req, res) => {
  const body = {};
  body.url = req.url;
  if (req.method !== 'GET') {
    body += await postReceiver(req);
  }
  const file = await router(body);
  res.status = file.status;
  res.setHeader('Content-Type', file.mime || 'application/json');
  res.end(file.body);
};

http.createServer(requestHandler).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

require('dotenv').config();
global.salt = process.env.salt;

global.http = require('http');
global.fs = require('fs');
global.path = require('path');
global.staticFiles = require('./api/static');
global.dataReceiver = require('./api/dataReceiver');
global.isValidObject = require('./api/validate');
global.bcrypt = require('bcrypt');

global.api = {};
api.db = require('./api/database');
api.searchUser = require('./api/searchUser');
api.register = require('./api/register');
api.login = require('./api/login');
api.logout = require('./api/logout');
api.notes = require('./api/notes');
api.modifyNote = require('./api/modifyNote');
api.deleteNote = require('./api/deleteNote');
api.createNote = require('./api/createNote');

global.router = require('./api/routing');

const requestHandler = async (req, res) => {
  let body = {};
  if (req.method !== 'GET') {
    body = await dataReceiver(req);
  }
  if (req.headers.cookie) {
    body.cookieToken = req.headers.cookie.split('=')[1];
  }
  body.url = req.url;
  const file = await router(body);
  const headers = { 'Content-Type': file.mime || 'application/json' };
  if (file.header) {
    headers['Set-Cookie'] = file.header;
  }
  res.writeHead(file.status, headers);
  res.end(file.body);
};

http.createServer(requestHandler).listen(5432);

process.stdout.write('Server running at http://localhost:8125/');

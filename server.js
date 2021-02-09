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
api.register = require('./api/register');
api.login = require('./api/login');
api.notes = require('./api/notes');
api.addNotes = require('./api/addNote');
api.searchUser = require('./api/searchUser');

global.router = require('./api/routing');

const requestHandler = async (req, res) => {
  let body = {};
  if (req.method !== 'GET') {
    body = await dataReceiver(req);
  }
  body.url = req.url;
  const file = await router(body);
  const headers = { 'Content-Type': file.mime || 'application/json' };
  if (body.token) {
    headers['Set-Cookie'] = `token=${body.token}`;
  }
  res.writeHead(file.status, headers);
  res.end(file.body);
};

http.createServer(requestHandler).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

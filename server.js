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
  body.url = req.url;
  if (req.method !== 'GET') {
    body += await dataReceiver(req);
  }
  const file = await router(body);
  res.writeHead(file.status, {
    'Content-Type': file.mime || 'application/json',
  });
  res.end(file.body);
};

http.createServer(requestHandler).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

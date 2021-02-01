require('dotenv').config();
global.salt = process.env.salt;

const fileShortcuts = { '/': 'index.html', '/app': 'app.html' };
global.http = require('http');
global.fs = require('fs');
global.path = require('path');
global.staticFile = require('./api/static');
global.postReceiver = require('./api/postReceiver');
global.isValidObject = require('./api/validate');
global.bcrypt = require('bcrypt');

global.api = {};
api.db = require('./api/database');
api.register = require('./api/register');
api.login = require('./api/login');
api.notes = require('./api/notes');
api.addNotes = require('./api/addNote');
api.routing = require('./api/routing');
api.searchUser = require('./api/searchUser');

const requestHandler = async (req, res) => {
  const body = await postReceiver(req);
  if (api.routing[req.url]) {
    const result = await api.routing[req.url](body);
    if (req.url === '/api/register') {
      res.setHeader('Set-Cookie', `token=${result.body.token}; HttpOnly`);
    }
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.body));
  } else {
    const file = await staticFile(fileShortcuts[req.url] || req.url);
    res.writeHead(200, { 'Content-Type': file.mime });
    res.end(file.data);
  }
};

http.createServer(requestHandler).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

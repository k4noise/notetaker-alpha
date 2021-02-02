require('dotenv').config();
global.salt = process.env.salt;

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
const { routing, shortUrl } = require('./api/routing');
api.routing = routing;
api.shortUrl = shortUrl;
api.searchUser = require('./api/searchUser');

const requestHandler = async (req, res) => {
  let body = req.url;
  if (req.method !== 'GET') {
    body = await postReceiver(req);
  }
  if (api.routing[req.url]) {
    const result = await api.routing[req.url](body);
    if (req.url === '/api/register') {
      res.setHeader('Set-Cookie', `token=${result.body.token}; HttpOnly`);
    }
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.body));
  } else {
    const file = await staticFile(api.shortUrl[req.url] || req.url);
    res.writeHead(200, { 'Content-Type': file.mime });
    res.end(file.body);
  }
};

http.createServer(requestHandler).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

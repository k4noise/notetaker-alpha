require('dotenv').config();
global.salt = process.env.salt;

const fileShortcuts = { '/': 'index.html', '/app': 'app.html' };
global.mod = {};
mod.http = require('http');
mod.fs = require('fs');
mod.path = require('path');
mod.bcrypt = require('bcrypt');
mod.isValidObject = require('./api/validate');
mod.static = require('./api/static');

global.api = {};
api.db = require('./api/database');
api.register = require('./api/register');
api.login = require('./api/login');
api.notes = require('./api/notes');
api.routing = require('./api/routing');
api.searchUser = require('./api/searchUser');

if (api.db) {
  api.db.query(`create table if not exists users(
    login varchar(20),
    password varchar(60),
    token varchar(20)
  )`);
}

const onRequest = async (req, res) => {
  let body = '';
  if (req.method !== 'GET') {
    await req.on('data', (chunk) => {
      body += chunk.toString();
    });
    body = JSON.parse(body);
  }
  if (api.routing[req.url]) {
    const result = await api.routing[req.url](body);
    if (req.url === '/api/register') {
      res.setHeader('Set-Cookie', `token=${result.body.token}; HttpOnly`);
    }
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.body));
  } else {
    const file = await mod.static(fileShortcuts[req.url] || req.url);
    res.writeHead(200, { 'Content-Type': file.mime });
    res.end(file.data);
  }
};

mod.http.createServer(onRequest).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

const fileShortcuts = { '/': 'index.html', '/app': 'app.html' };
global.mod = {};
mod.http = require('http');
mod.fs = require('fs');
mod.path = require('path');
mod.bcrypt = require('bcrypt');

global.api = {};
api.db = require('./api/database');
api.register = require('./api/register');
api.login = require('./api/login');
api.routing = require('./api/routing');

require('dotenv').config();
global.salt = process.env.salt;

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
    if (result.body) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.body));
    } else {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.body));
    }
  } else {
    const filePath = fileShortcuts[req.url] || `.${req.url}`;
    const extname = mod.path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.woff': 'application/font-woff',
      '.svg': 'image/svg+xml'
    };

    contentType = mimeTypes[extname] || 'application/octet-stream';
    mod.fs.access(filePath, (error) => {
      if (error) {
        mod.fs.readFile('./404.html', function (error, content) {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        });
      } else {
        mod.fs.readFile(filePath, (error, content) => {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        });
      }
    });
  }
};

mod.http.createServer(onRequest).listen(8125);

process.stdout.write('Server running at http://localhost:8125/');

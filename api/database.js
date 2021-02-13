const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'notetaker',
  password: '9757',
  port: 5432,
});

client.connect();

client.query(`create table if not exists users(
    login varchar(20),
    password varchar(60),
    token varchar(20)
  )`);

module.exports = client;

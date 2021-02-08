const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: '9757',
  port: 5432,
});
client.query('create database notetaker').then((err, res) => {
  console.log(res);
});
process.stdout.write('База успешно создана');

const {Client} = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres:9757@127.0.0.1:5432/notetaker'
});
client.connect();

// {
//   user: 'postgres',
//   host: '127.0.0.1',
//   database: 'notetaker',
//   password: '9757',
//   port: 3651
// }

module.exports = client;

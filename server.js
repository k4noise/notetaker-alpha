const express = require('express');
const app = express();
const opn = require('opn');

app.use(express.static('./'));

const server = app.listen(8000, () => {
  const host = 'localhost';
  const port = server.address().port;
  console.log('Express app listening at http://%s:%s', host, port);
  // opn(`http://${host}:${port}`);
});

const fs = require('fs');
const bcrypt = require('bcrypt');
fs.writeFileSync('./.env', `salt=${bcrypt.genSaltSync(10)}`);

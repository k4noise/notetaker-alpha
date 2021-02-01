const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.woff': 'application/font-woff',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Читает статический файл и отдает его серверу
 * @param {string} fileName Имя запрашиваемого файла
 * @returns {object} Содержит MIME-тип и буфер прочитанного файла
 */
const staticFiles = (fileName) => {
  const response = {},
    filePath = `./${fileName}`,
    ext = path.extname(filePath).toLowerCase();
  response.mime = MIME_TYPES[ext] || 'application/octet-stream';
  response.body = fs.existsSync(filePath)
    ? fs.readFileSync(filePath)
    : fs.readFileSync('./404.html');
  response.status = 200;
  return response;
};

module.exports = staticFiles;

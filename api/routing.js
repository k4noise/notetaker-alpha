const routing = {
  '/api/register': api.register,
  '/api/login': api.login,
  '/api/notes': api.notes,
  '/api/addNote': api.addNotes,
};

const shortUrl = { '/': 'index.html', '/app': 'app.html' };

module.exports = { routing, shortUrl };

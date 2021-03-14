import { openDB } from '/node_modules/idb/with-async-ittr.js';

const idb = await openDB('notetaker', 1, {
  upgrade(db) {
    db.createObjectStore('notes', {
      keyPath: 'key',
      autoIncrement: true,
    });
  },
});

export default idb;

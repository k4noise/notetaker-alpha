import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

const idb = await openDB('notetaker', 1, {
  upgrade(db) {
    db.createObjectStore('notes', {
      keyPath: 'key',
      autoIncrement: true,
    });
  },
});

export default idb;

let isConnected = false;

import idb from './indexedDB.js';

const openTransaction = (method) => {
  let transaction = idb.transaction('notes', method);
  return transaction.objectStore('notes');
};

const addNoteIdb = (note) => {
  const store = openTransaction('readwrite');
  store.put(note);
};

const deleteNoteIdb = (key) => {
  const store = openTransaction('readwrite');
  store.delete(key);
};

const modifyNoteButton = document.querySelector('.notes__note-add'),
  notePreview = document.querySelector('.note__preview'),
  closeNotePreviewButton = document.querySelector('.note__preview-close'),
  changeColorIcon = document.querySelector('.note__preview-change-color'),
  notePreviewHeader = document.querySelector('.note__preview-header'),
  notePreviewText = document.querySelector('.note__preview-text');

let autoSaveTimer;

/**
 * Генерирует приятный рандомный цвет
 * @returns {string} Цвет в hex формате
 */
const randomColor = () => {
  const r = (Math.round(Math.random() * 127) + 127).toString(16),
    g = (Math.round(Math.random() * 127) + 127).toString(16),
    b = (Math.round(Math.random() * 127) + 127).toString(16);
  return `#${r}${g}${b}`;
};

/**
 * Генерирует 10-символьный ключ для идиентификации заметок
 * @returns {string} Ключ
 */
const randomKey = () => Math.random().toString(16).slice(5, 15);

/**
 * Генерирует дату в соответствии с форматом
 * @param {object} date Дата
 * @returns {string} Дата в нужном формате
 */
const dateGenerator = (date) =>
  new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

const getNoteObject = (note, key) => {
  return {
    key: key || note.key,
    color: note.color,
    header: note.header,
    text: note.text,
    date: note.date,
  };
};

const notes = {};

/**
 * Создает объект заметки, открывает режим редактирования
 * @returns {void}
 */
const createNote = () => {
  const currentNote = {
    key: randomKey(),
    color: randomColor(),
    date: new Date(),
  };
  const key = currentNote.key;
  notes[key] = currentNote;
  showNote(currentNote);
  saveNote(key);
  addNoteIdb(getNoteObject(currentNote));
};

/**
 * Создает плитку заметки
 * @param {object} note Объект заметки
 * @returns {void}
 */
const createTile = (note) => {
  const tile = document.createElement('div');
  tile.classList.add('notes__note');
  tile.dataset.key = note.key;
  tile.style.backgroundColor = note.color;
  tile.innerHTML = `
        <button class="notes__note-button">
          <img
          src="./img/x_white.svg"
          alt="Кнопка удаления заметки"
          class="notes__note-delete"
          />
        </button>
          <h3 class="subtitle notes__note-header">${
            note.header || 'Без заголовка'
          }</h3>
          <span class="notes__note-date">${dateGenerator(
            note.date || note['created_at']
          )}</span>
        <button class="notes__note-button">
          <img
          src="./img/edit.svg"
          alt="Кнопка редактирования заметки"
          class="notes__note-edit"
          />
        </button>`;

  modifyNoteButton.after(tile);
  note.tile = tile;
  tile.addEventListener('click', (event) => tileClicks(event, note));
};

/**
 * Открывает режим редактирования заметки
 * @param {object} note Объект заметки
 * @returns {void}
 */
const showNote = (note) => {
  const autoSaveDelay = 4000;
  window.scrollTo(0, 0);
  notePreview.classList.add('visible');
  notePreview.style.backgroundColor = note.color;
  notePreviewHeader.value = note.header || '';
  notePreviewText.value = note.text || '';
  closeNotePreviewButton.addEventListener('click', (event) =>
    closeNote(event, note)
  );
  notePreview.onkeyup = (event) => updateNote(event, note);
  changeColorIcon.addEventListener('click', (event) =>
    changeColor(event, note)
  );
  autoSaveTimer = setInterval(() => saveNote(note.key), autoSaveDelay);
};

/**
 * Обновляет данные заметки
 * @param {object} event Объект события onclick кнопок на плитки заметки
 * @param {object} note Объект заметки
 * @returns {void}
 */
const updateNote = (event, note) => {
  const objectClass = event.target.classList.value,
    currentText = event.target.value || '';
  switch (objectClass) {
    case 'note__preview-text':
      note.text = currentText;
      break;
    case 'note__preview-header':
      if (event.key === 'Enter') {
        notePreviewText.focus();
      }
      note.header = currentText;
      break;
  }
};

/**
 * Обрабатывает клики на плитке заметки
 * @param {object} event Объект события onkeyup input или textarea, находящихся на плитке заметки
 * @param {object} note Объект заметки
 * @returns {void}
 */
function tileClicks(event, note) {
  switch (event.target.classList.value) {
    case 'notes__note-edit':
      showNote(note);
      break;
    case 'notes__note-delete':
      note.tile.remove();
      deleteNote(note.key);
      break;
    default:
      return;
  }
}

/**
 * @param {object} event Объект события onclick кнопки изменения цвета
 * @param {object} note Объект заметки
 * @returns {void}
 */
const changeColor = (event, note) => {
  const tile = note.tile,
    color = randomColor();
  event.preventDefault();
  note.color = color;
  saveNote(note.key);
  notePreview.style.backgroundColor = color;
  if (tile) {
    tile.style.backgroundColor = color;
  }
};

/**
 * Сохраняет заметку, отправив данные в localStroage
 * @param {string} key Ключ
 * @returns {void}
 */

const saveNote = (key) => {
  const note = notes[key];
  console.log(notes);
  if (note.hasOwnProperty('header') || note.hasOwnProperty('text')) {
    if (isConnected) {
      fetch('/api/modifyNote', {
        method: 'PATCH',
        body: JSON.stringify(getNoteObject(note, key)),
      });
    } else {
      addNoteIdb(getNoteObject(note));
    }
  }
};

/**
 * Удаляет заметку из localStroage
 * @param {string} key Ключ
 * @returns {void}
 */
const deleteNote = (key) => {
  if (isConnected) {
    fetch('/api/deleteNote', {
      method: 'DELETE',
      body: JSON.stringify({
        key,
      }),
    });
  } else {
    deleteNoteIdb(key);
    Reflect.deleteProperty(notes, key);
  }
};

/**
 * Закрывает окно заметки, сохраняет ее
 * @param {object} event Объект события onclick кнопки закрытия документа
 * @param {object} note Объект заметки
 * @returns {void}
 */
const closeNote = (event, note) => {
  event.preventDefault();
  let tile = note.tile;
  const key = note.key;
  notePreview.classList.remove('visible');
  clearInterval(autoSaveTimer);
  saveNote(key);
  notePreview.reset();

  if (!(note.header || note.text)) {
    deleteNote(key);
    return;
  } else if (tile == null) {
    createTile(note);
    tile = note.tile;
    saveNote();
  }

  const noteTileHeader = tile.querySelector('.notes__note-header');
  noteTileHeader.innerHTML = note.header || 'Без заголовка';
};

/**
 * Рендерит плитки заметок при их наличии в localStorage
 * @returns {void}
 */
const renderNoteTiles = async () => {
  let note;
  note = isConnected
    ? await fetch('/api/notes').json().note
    : await openTransaction('readonly').getAll();
  if (note) {
    note.forEach((noteObj) => {
      const key = noteObj.key;
      notes[key] = noteObj;
      createTile(notes[key]);
    });
  }
};

const loginData = await fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({}),
});

const userData = await loginData.json();
if (userData.code === 200) {
  document.querySelector('.navigation__login').innerHTML = userData.login;
  changeControls();
  isConnected = true;
}
renderNoteTiles();
modifyNoteButton.addEventListener('click', createNote);
notePreview.addEventListener('submit', (event) => event.preventDefault());

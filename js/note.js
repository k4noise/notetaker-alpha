let isConnected = false;

// const tryLogin = async () => {
//     const a = await fetch('/api/login', {
//       method: 'POST',
//       body: JSON.stringify({}),
//     });
//     const b = await a.json();
//     if (b.code === 200) {
//       document.querySelector('.navigation__login').innerHTML = b.login;
//       changeControls();
//       isConnected = true;
//     }
// };

// tryLogin();

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

const createNoteClass = () => {
  const note = {};
};

const getNoteObject = (note, key) => {
  return {
    key: key || note.key,
    color: note.color,
    header: note.header,
    text: note.text,
    date: note.date,
  };
};
class Note {
  #key = randomKey();
  #tile = null;
  color = randomColor();
  date = new Date();

  /**
   * Создает объект заметки из существующего объекта данных заметки
   * @param {object} noteObject Объект заметки
   * @param {string} key Ключ заметки
   * @returns {void}
   */
  readNote = (noteObject, key) => {
    this.#key = key;
    this.header = noteObject.header || '';
    this.text = noteObject.text || '';
    this.date = noteObject.date || noteObject['created_at'];
    this.color = noteObject.color;
  };

  /**
   * Геттер для приватного свойства #tile
   * @returns {object} Плитка заметки
   */
  getTile = () => this.#tile;

  /**
   * Геттер для приватного свойства #key
   * @returns {string} Ключ заметки
   */
  getKey = () => this.#key;

  /**
   * Сеттер для приватного свойства #tile
   * @param {object} tile Плитка заметки
   * @returns {void}
   */
  setTile = (tile) => {
    this.#tile = tile;
  };

  /**
   * Сеттер для публичного свойства color
   * @param {string} color Новый цвет
   * @returns {void}
   */
  setColor = (color) => {
    this.color = color;
  };

  /**
   * Сеттер для публичного свойства text
   * @param {string} text Новый текст
   * @returns {void}
   */
  setText = (text) => {
    this.text = text;
  };

  /**
   * Сеттер для публичного свойства text
   * @param {string} header Новый текст
   * @returns {void}
   */
  setHeader = (header) => {
    this.header = header;
  };
}

// Объект для хранения объектов заметок в следующем виде:
// key: { Note object }
const notes = {};

/**
 * Создает объект заметки, открывает режим редактирования
 * @returns {void}
 */
const createNote = () => {
  const currentNote = new Note(),
    key = currentNote.getKey();
  notes[key] = currentNote;
  showNote(currentNote);
  saveNote(key);
  localStorage.setItem('keysArray', Object.keys(notes));
};

/**
 * Создает плитку заметки
 * @param {object} note Объект заметки
 * @returns {void}
 */
const createTile = (note) => {
  const key = note.getKey(),
    tile = document.createElement('div');
  tile.classList.add('notes__note');
  tile.dataset.key = key;
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
          <span class="notes__note-date">${dateGenerator(note.date)}</span>
        <button class="notes__note-button">
          <img
          src="./img/edit.svg"
          alt="Кнопка редактирования заметки"
          class="notes__note-edit"
          />
        </button>`;

  modifyNoteButton.after(tile);
  note.setTile(tile);
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
  autoSaveTimer = setInterval(() => saveNote(note.getKey()), autoSaveDelay);
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
      note.setText(currentText);
      break;
    case 'note__preview-header':
      if (event.key === 'Enter') {
        notePreviewText.focus();
      }
      note.setHeader(currentText);
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
      note.getTile().remove();
      deleteNote(note.getKey());
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
  const tile = note.getTile(),
    color = randomColor();
  event.preventDefault();
  note.setColor(color);
  saveNote(note.getKey());
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
  if (note.header || note.text) {
    if (isConnected) {
      fetch('/api/modifyNote', {
        method: 'PATCH',
        body: JSON.stringify(getNoteObject(note, key)),
      });
    } else {
      localStorage.setItem(key, JSON.stringify(note));
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
    localStorage.removeItem(key);
    Reflect.deleteProperty(notes, key);
    localStorage.setItem('keysArray', Object.keys(notes));
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
  let tile = note.getTile();
  const key = note.getKey();
  notePreview.classList.remove('visible');
  clearInterval(autoSaveTimer);
  saveNote(key);
  notePreview.reset();

  if (!(note.header || note.text)) {
    deleteNote(key);
    return;
  } else if (tile == null) {
    createTile(note);
    tile = note.getTile();
    isConnected
      ? saveNote()
      : localStorage.setItem('keysArray', Object.keys(notes));
  }

  const noteTileHeader = tile.querySelector('.notes__note-header');
  noteTileHeader.innerHTML = note.header || 'Без заголовка';
};

/**
 * Рендерит плитки заметок при их наличии в localStorage
 * @returns {void}
 */
const renderNoteTiles = async () => {
  let notesKeys;
  let note;
  if (isConnected) {
    note = await fetch('/api/notes');
    note = await note.json();
    note = note.notes;
    notesKeys = Object.keys(note);
  } else {
    const keysArray = localStorage.getItem('keysArray');
    notesKeys = keysArray.split(',');
  }
  if (notesKeys) {
    notesKeys.forEach((key) => {
      const currentNote = note
          ? note[key]
          : JSON.parse(localStorage.getItem(key)),
        noteObject = new Note();
      noteObject.readNote(currentNote, key);
      notes[key] = noteObject;
      createTile(notes[key]);
    });
  }
};

(async () => {
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
})();

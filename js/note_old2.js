const addNoteButton = document.querySelector('.notes__note-add'),
  notePreview = document.querySelector('.note__preview'),
  closeNotePreviewButton = document.querySelector('.note__preview-close'),
  changeColorIcon = document.querySelector('.note__preview-change-color'),
  notePreviewHeader = document.querySelector('.note__preview-header'),
  notePreviewText = document.querySelector('.note__preview-text');

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
 * @returns {string} Дата в нужном формате
 */
const dateGenerator = () =>
  new Date().toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

// Создает заметку
class Note {
  #key = randomKey();
  #noteTile = null;
  color = randomColor();
  date = dateGenerator();
  #autoSave;

  /**
   * Создает объект заметки и помещает в массив с ключом this.#key
   * @returns {string} Ключ заметки
   */
  createNote = () => {
    this.showNote();
    this.saveNote();
    return this.#key;
  };

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
    this.date = noteObject.date;
    this.color = noteObject.color;
  };

  /**
   * Сохраняет заметку, отправив данные в localStroage
   * @returns {void}
   */
  saveNote = () => {
    localStorage.setItem(this.#key, JSON.stringify(this));
  };

  /**
   * @param {object} event Объект события onclick кнопок на плитки заметки
   * @returns {void}
   */
  updateNote = (event) => {
    const objectClass = event.target.classList.value,
      currentText = event.target.value;
    switch (objectClass) {
      case 'note__preview-text':
        this.text = currentText;
        break;
      case 'note__preview-header':
        this.header = event.target.value || '';
        break;
    }
  };

  /**
   * @param {object} event Объект события onclick кнопки изменения цвета
   * @returns {void}
   */
  changeColor = (event) => {
    event.preventDefault();
    this.color = randomColor();
    notePreview.style.backgroundColor = this.color;
    if (this.#noteTile) {
      this.#noteTile.style.backgroundColor = this.color;
    }
  };

  /**
   * Открывает режим редактирования заметки
   * @returns {void}
   */
  showNote = () => {
    window.scrollTo(0, 0);
    notePreview.classList.add('visible');
    notePreview.style.backgroundColor = this.color;
    notePreviewHeader.value = this.header || '';
    notePreviewText.value = this.text || '';
    notePreview.addEventListener('keyup', this.updateNote);
    closeNotePreviewButton.addEventListener('click', this.closeNote);
    changeColorIcon.addEventListener('click', this.changeColor);
    this.#autoSave = setInterval(() => this.saveNote(), 5000);
  };

  /**
   * Удаляет заметку из localStorage
   * @returns {void}
   */
  deleteNote = () => {
    localStorage.removeItem(this.#key);
    deleteNoteElement(this.#key);
  };

  /**
   * Обрабатывает клики на плитке заметки
   * @param {object} event Объект события onkeyup input и textarea, находящихся на плитке заметки
   * @returns {void}
   */
  noteTileClicks = (event) => {
    switch (event.target.classList.value) {
      case 'notes__note-edit':
        this.showNote();
        break;
      case 'notes__note-delete':
        this.#noteTile.remove();
        this.deleteNote();
        break;
      default:
        return;
    }
  };

  /**
   * Создает плитку заметки
   * @returns {void}
   */
  createNoteTile = () => {
    this.#noteTile = document.createElement('div');
    this.#noteTile.classList.add('notes__note');
    this.#noteTile.style.backgroundColor = this.color;
    this.#noteTile.innerHTML = `
          <img
          src="./img/x_white.svg"
          alt="Кнопка удаления заметки"
          class="notes__note-delete"
          />
          <h3 class="subtitle notes__note-header">${
            this.header || 'Без заголовка'
          }</h3>
          <span class="notes__note-date">${this.date}</span>
          <img
          src="./img/edit.svg"
          alt="Кнопка редактирования заметки"
          class="notes__note-edit"
          />`;
    addNoteButton.after(this.#noteTile);
    this.#noteTile.addEventListener('click', this.noteTileClicks);
  };

  /**
   * @param {object} event Объект события onclick кнопки закрытия документа
   * @returns {void}
   */
  closeNote = (event) => {
    event.preventDefault();
    notePreview.classList.remove('visible');
    notePreview.removeEventListener('keyup', this.updateNote);
    clearInterval(this.#autoSave);
    this.saveNote();
    notePreview.reset();

    if (!(this.header || this.text)) {
      this.deleteNote();
      return;
    } else if (this.#noteTile == null) {
      this.createNoteTile();
      localStorage.setItem('keysArray', Object.keys(notes));
    }

    const noteTileHeader = this.#noteTile.querySelector('.notes__note-header');
    noteTileHeader.innerHTML = this.header || 'Без заголовка';
  };
}

// Объект для хранения объектов заметок в следующем виде: ключ заметки: { Note object }
const notes = {};

/**
 * Рендерит плитки заметок при их наличии
 * @returns {void}
 */
const renderNoteTiles = () => {
  localStorage
    .getItem('keysArray')
    ?.split(',')
    .forEach((key) => {
      const currentNote = JSON.parse(localStorage.getItem(key)),
        noteObject = new Note();
      noteObject.readNote(currentNote, key);
      notes[key] = noteObject;
      noteObject.createNoteTile();
    });
};

/**
 * Выполняет создание нового элемента в объекте заметок
 * @param {object} event Объект события onclick кнопки добавления заметок
 * @returns {void}
 */
const createNoteElement = (event) => {
  event.preventDefault();
  const noteObject = new Note();
  const key = noteObject.createNote();
  notes[key] = noteObject;
};

/**
 * Выполняет удаление элемента в объекте заметок
 * @param {string} key Ключ заметки
 * @returns {void}
 */
const deleteNoteElement = (key) => {
  Reflect.deleteProperty(notes, key);
  localStorage.setItem('keysArray', Object.keys(notes));
};

renderNoteTiles();

addNoteButton.addEventListener('click', createNoteElement);

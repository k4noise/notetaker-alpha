'use strict';
const addNoteButton = document.querySelector('.notes__note-add'),
  notePreview = document.querySelector('.note__preview'),
  closeNotePreviewButton = document.querySelector('.note__preview-close'),
  changeColorIcon = document.querySelector('.note__preview-change-color-icon'),
  notePreviewHeader = document.querySelector('.note__preview-header'),
  notePreviewText = document.querySelector('.note__preview-text');

let keysOfNotes = localStorage.getItem('keysArray')?.split(',') || [],
  currentNote = {},
  key,
  date,
  autoSave;

/**
 * Генерирует приятный рандомный цвет (пастель)
 * @returns {string} Цвет в hex формате
 */
const randomColor = () => {
  const r = (Math.round(Math.random() * 127) + 127).toString(16),
    g = (Math.round(Math.random() * 127) + 127).toString(16),
    b = (Math.round(Math.random() * 127) + 127).toString(16);
  return `#${r}${g}${b}`;
};

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

/**
 * Генерирует 10-символьный ключ для идиентификации заметок
 * @returns {string} sdf
 */
const randomKey = () => Math.random().toString(16).slice(5, 15);

/**
 * Создает плитку заметки на основании данных объекта currentNote
 * @returns {void}
 */
const createNoteTile = () => {
  addNoteButton.insertAdjacentHTML(
    'afterend',
    `<div class="notes__note" style='background-color: ${currentNote.color};' data-key='${key}'>
          <img
          src="./img/x_white.svg"
          alt="Кнопка удаления заметки"
          class="notes__note-delete"
          onclick='deleteNote(this)'
          />
          <h3 class="notes__note-header">${currentNote.header}</h3>
          <span class="notes__note-date">${currentNote.date}</span>
          <img
          src="./img/edit.svg"
          alt="Кнопка редактирования заметки"
          class="notes__note-edit"
          onclick="showNote(this)"
          />
        </div>`
  );
};

/**
 * Выполняет рендер заметок при загрузке страницы при условии, что они создавались
 * @returns {void}
 */
const getNote = () => {
  keysOfNotes.forEach((noteKey) => {
    currentNote = JSON.parse(localStorage.getItem(noteKey));
    if (!currentNote) {
      return;
    }
    key = noteKey;
    createNoteTile();
  });
  currentNote = {};
  key = false;
};

/**
 * Открывает заметку (режим просмотра / редактирования). Если заметка создается, то в параметр передается false.
 * @param {object | boolean} showNoteButton Объект события onclick кнопки редактирования заметки или значение false
 * @returns {void}
 */
const showNote = (showNoteButton) => {
  window.scrollTo(0, 0);
  notePreview.classList.add('visible');
  if (showNoteButton) {
    key = showNoteButton.closest('.notes__note').dataset.key;
    currentNote = JSON.parse(localStorage.getItem(key));
    notePreview.style.backgroundColor = currentNote.color;
    notePreviewHeader.value = currentNote.header;
    notePreviewText.value = currentNote.text;
    notePreview.dataset.key = key;
  } else {
    const color = randomColor();
    notePreview.style.backgroundColor = color;
    currentNote.color = color;
  }
  autoSave = setInterval(() => saveNote(), 3000);
};

/**
 * Выполняет изменение данных заметки из режима редактирования
 * @returns {void}
 */
function saveNote() {
  switch (this.classList.value) {
    case 'note__preview-text':
      currentNote.text = this.classList.value;
      break;
    case 'note__preview-header':
      currentNote.header = this.classList.value;
      break;
  }
}

/**
 * Выполняет изменение цвета заметки в режиме редактирования
 * @param {object} event Объект события onclick кнопки измения цвета
 * @returns {void}
 */
const changeColor = (event) => {
  event.preventDefault();
  const color = randomColor();
  notePreview.style.backgroundColor = color;
  currentNote.color = color;
};

/**
 * Выполняет удаление заметки
 * @param {object} noteDeleteButton Кнопка для удаления заметки
 * @returns {void}
 */
const deleteNote = (noteDeleteButton) => {
  const note = noteDeleteButton.closest('.notes__note'),
    noteKey = note.dataset.key;
  note.remove();
  keysOfNotes.splice(keysOfNotes.indexOf(noteKey), 1);
  localStorage.removeItem(noteKey);
  localStorage.setItem('keysArray', keysOfNotes.toString());
};

const saveNote = () => {
  !this.key
    ? addNote()
    : localStorage.setItem(this.key, JSON.stringify(currentNote));
};

/**
 * Выполняет сохранение и/или добавление заметки
 * @returns {void}
 */
function addNote() {
  if (key) {
    localStorage.setItem(key, JSON.stringify(currentNote));
    const note = document.querySelector(`div [data-key="${key}"]`);
    note.querySelector('.notes__note-header').innerHTML = currentNote.header;
    note.style.backgroundColor = currentNote.color;
  } else {
    if (!currentNote.header) {
      currentNote = {};
      return false;
    } else if (!currentNote.text) {
      currentNote.text = '';
    }
    key = randomKey();
    date = dateGenerator();
    currentNote.date = date;
    createNoteTile();
    localStorage.setItem(key, JSON.stringify(currentNote));
    keysOfNotes.push(key);
    localStorage.setItem('keysArray', keysOfNotes.toString());
  }
}

/**
 * Закрывает заметку
 * @param {object} event Объект события onclick кнопки закрытия заметки
 * @returns {void}
 */
function closeNote(event) {
  event.preventDefault();
  notePreview.classList.remove('visible');
  notePreview.reset();
  if (notePreview.dataset.key) {
    addNote(notePreview.dataset.key);
    notePreview.removeAttribute('data-key');
  } else {
    addNote();
  }
  currentNote = {};
  this.key = false;
  clearInterval(autoSave);
}

getNote();

addNoteButton.addEventListener('click', () => showNote(false));

closeNotePreviewButton.addEventListener('click', (event) => closeNote(event));

changeColorIcon.addEventListener('click', function (event) {
  changeColor(event);
});

notePreviewText.addEventListener('keyup', saveNote);

notePreviewHeader.addEventListener('keyup', saveNote);

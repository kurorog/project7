// DOM элементы
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');
const offlineStatus = document.getElementById('offline-status');

// Массив для хранения заметок
let notes = [];

// Проверка онлайн статуса
function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineStatus.textContent = 'Онлайн';
        offlineStatus.classList.remove('offline');
    } else {
        offlineStatus.textContent = 'Офлайн-режим';
        offlineStatus.classList.add('offline');
    }
}

// Загрузка заметок из localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }
}

// Сохранение заметок в localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Отображение заметок
function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <div class="note-text">${note.text}</div>
            <div class="note-actions">
                <button class="edit-note" data-index="${index}">✎</button>
                <button class="delete-note" data-index="${index}">×</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });

    // Добавляем обработчики для кнопок
    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteNote(index);
        });
    });

    document.querySelectorAll('.edit-note').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            editNote(index);
        });
    });
}

// Добавление новой заметки
function addNote() {
    const text = noteInput.value.trim();
    if (text) {
        notes.push({ text });
        noteInput.value = '';
        saveNotes();
        renderNotes();
    }
}

// Удаление заметки
function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

// Редактирование заметки
function editNote(index) {
    noteInput.value = notes[index].text;
    addNoteBtn.textContent = 'Обновить';
    
    // Изменяем обработчик кнопки на обновление
    addNoteBtn.onclick = function() {
        const text = noteInput.value.trim();
        if (text) {
            notes[index].text = text;
            noteInput.value = '';
            addNoteBtn.textContent = 'Добавить';
            saveNotes();
            renderNotes();
            // Возвращаем стандартный обработчик
            addNoteBtn.onclick = addNote;
        }
    };
}

// Регистрация Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker зарегистрирован');
            })
            .catch(err => {
                console.log('Ошибка регистрации ServiceWorker:', err);
            });
    }
}

// Инициализация приложения
function init() {
    // Слушатели событий
    addNoteBtn.addEventListener('click', addNote);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Загрузка данных
    loadNotes();
    updateOnlineStatus();
    registerServiceWorker();
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);

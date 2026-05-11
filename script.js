document.addEventListener('DOMContentLoaded', () => {
  let tasks = [];
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }

  const board = document.getElementById('board');
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const counter = document.getElementById('taskCounter');

  const columns = ['todo', 'inprogress', 'review', 'done'];
  const columnNames = {
    todo: 'К выполнению',
    inprogress: 'В процессе',
    review: 'На проверке',
    done: 'Готово'
  };

  function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function render() {
    board.innerHTML = '';

    columns.forEach(colId => {
      const col = document.createElement('div');
      col.className = 'column';
      col.dataset.status = colId;

      col.innerHTML = `<div class="column-header">
        <h3>${columnNames[colId]}</h3>
        <span class="badge">${tasks.filter(t => t.status === colId).length}</span>
      </div>`;

      tasks.filter(t => t.status === colId).forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.innerHTML = `
          <span>${task.text}</span>
          <div>
            <button class="edit-btn">редактировать</button>
            <button class="del-btn">удалить</button>
          </div>
        `;

        card.addEventListener('dragstart', () => {
          card.classList.add('dragging');
          card.dataset.id = task.id;
        });
        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });

        card.querySelector('.del-btn').onclick = () => {
          tasks = tasks.filter(t => t.id !== task.id);
          save();
          render();
        };
        card.querySelector('.edit-btn').onclick = () => {
          const text = prompt('Изменить:', task.text);
          if (text) {
            task.text = text;
            save();
            render();
          }
        };

        col.appendChild(card);
      });

      if (tasks.filter(t => t.status === colId).length === 0) {
        col.innerHTML += '<p class="empty-message">Пока пусто</p>';
      }

      col.addEventListener('dragover', e => e.preventDefault());
      col.addEventListener('drop', e => {
        e.preventDefault();
        const card = document.querySelector('.dragging');
        if (card) {
          const taskId = card.dataset.id;
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            task.status = colId;
            save();
            render();
          }
        }
      });

      board.appendChild(col);
    });

    counter.textContent = `Всего задач: ${tasks.length}`;
  }

  addBtn.onclick = () => {
    const text = input.value.trim();
    if (text) {
      tasks.push({
        id: Date.now().toString(),
        text: text,
        status: 'todo'
      });
      input.value = '';
      save();
      render();
    }
  };

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addBtn.click();
  });

  render();
});
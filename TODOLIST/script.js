const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

const STORAGE_KEY = 'todoListTasks';
const THEME_KEY = 'todoListTheme';

function getStoredTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setStoredTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.body.classList.toggle('dark-mode', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function createTaskLi(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (task.done) li.classList.add('completed');
  li.dataset.id = task.id;

  const left = document.createElement('div');
  left.className = 'task-left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    li.classList.toggle('completed', task.done);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index > -1) {
      tasks[index].done = task.done;
      setStoredTasks(tasks);
    }
  });

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = `${task.text} - ${new Date(task.date).toLocaleDateString()}`;

  left.appendChild(checkbox);
  left.appendChild(text);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remover';
  removeBtn.type = 'button';
  removeBtn.className = 'remove-btn';
  removeBtn.addEventListener('click', () => {
    const tasks = getStoredTasks().filter((t) => t.id !== task.id);
    setStoredTasks(tasks);
    taskList.removeChild(li);
  });

  li.appendChild(left);
  li.appendChild(removeBtn);

  return li;
}

function renderTasks() {
  taskList.innerHTML = '';
  const tasks = getStoredTasks();
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  tasks.forEach((task) => taskList.appendChild(createTaskLi(task)));
}

addTaskBtn.addEventListener('click', () => {
  const textValue = taskInput.value.trim();
  const dateValue = dateInput.value;

  if (!textValue || !dateValue) {
    alert('Por favor, preencha a tarefa e a data antes de adicionar.');
    return;
  }

  const tasks = getStoredTasks();
  const task = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    text: textValue,
    date: dateValue,
    done: false,
  };

  tasks.push(task);
  setStoredTasks(tasks);
  taskList.appendChild(createTaskLi(task));

  taskInput.value = '';
  dateInput.value = '';
  taskInput.focus();
});

renderTasks();

// Initialize theme
setTheme(getTheme());

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

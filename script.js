const STORAGE_KEY = "studyTasks";

const form = document.getElementById("task-form");
const nameInput = document.getElementById("task-name");
const subjectInput = document.getElementById("task-subject");
const errorMessage = document.getElementById("error-message");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const remainingCount = document.getElementById("remaining-count");

let tasks = loadTasks();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const subject = subjectInput.value.trim();

  if (!name || !subject) {
    showError("Please enter both a task name and a subject.");
    return;
  }

  hideError();

  tasks.push({
    id: Date.now().toString(),
    name: name,
    subject: subject,
    completed: false
  });

  nameInput.value = "";
  subjectInput.value = "";
  saveAndRender();
});

taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const id = button.getAttribute("data-id");

  if (button.classList.contains("btn-complete")) {
    toggleTask(id);
  }

  if (button.classList.contains("btn-delete")) {
    deleteTask(id);
  }
});

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return {
        id: task.id,
        name: task.name,
        subject: task.subject,
        completed: !task.completed
      };
    }
    return task;
  });
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderTasks();
  updateCounts();
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " completed" : "");

    const completeLabel = task.completed ? "Undo" : "Complete";

    item.innerHTML =
      '<div class="task-info">' +
        '<p class="task-name"></p>' +
        '<p class="task-subject"></p>' +
      "</div>" +
      '<div class="task-actions">' +
        '<button type="button" class="btn-complete" data-id="' + task.id + '">' + completeLabel + "</button>" +
        '<button type="button" class="btn-delete" data-id="' + task.id + '">Delete</button>' +
      "</div>";

    item.querySelector(".task-name").textContent = task.name;
    item.querySelector(".task-subject").textContent = task.subject;
    taskList.appendChild(item);
  });
}

function updateCounts() {
  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  remainingCount.textContent = tasks.length - completed;
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

renderTasks();
updateCounts();

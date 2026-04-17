const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const tasksSummary = document.getElementById("tasks-summary");
const tasksCountChip = document.getElementById("tasks-count-chip");
const tasksRemainingLabel = document.getElementById("tasks-remaining-label");
const tasksCompletedLabel = document.getElementById("tasks-completed-label");

const STORAGE_KEY = "modern_todo_tasks_v1";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn("Failed to load tasks from storage", e);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("Failed to save tasks to storage", e);
  }
}

function createTaskObject(text) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (!tasks.length) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    const checkbox = document.createElement("button");
    checkbox.className = "task-checkbox";
    checkbox.setAttribute("type", "button");
    checkbox.setAttribute("aria-label", "Toggle task completion");

    const checkboxInner = document.createElement("div");
    checkboxInner.className = "task-checkbox-inner";
    checkbox.appendChild(checkboxInner);

    const main = document.createElement("div");
    main.className = "task-main";

    const textEl = document.createElement("div");
    textEl.className = "task-text";
    textEl.textContent = task.text;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const createdPill = document.createElement("span");
    createdPill.className = "task-meta-pill";
    createdPill.textContent = "Added just now";

    meta.appendChild(createdPill);
    main.appendChild(textEl);
    main.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn";
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.textContent = "✕";

    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(main);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  updateStats(tasks);
}

function updateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  tasksCountChip.textContent = total.toString();
  tasksRemainingLabel.textContent = remaining + " open";
  tasksCompletedLabel.textContent = completed + " done";

  if (!total) {
    tasksSummary.textContent = "No tasks yet—start with one tiny win.";
  } else if (!completed) {
    tasksSummary.textContent = "You've queued " + total + " task" + (total === 1 ? "" : "s") + ". Pick one and start.";
  } else if (completed === total) {
    tasksSummary.textContent = "Everything cleared. Protect the margin, not the backlog.";
  } else {
    tasksSummary.textContent =
      completed + " of " + total + " done. Close one more loop before you switch contexts.";
  }
}

function addTaskFromInput() {
  const value = taskInput.value.trim();
  if (!value) return;

  const tasks = loadTasks();
  const newTask = createTaskObject(value);
  const updated = [newTask, ...tasks];

  saveTasks(updated);
  renderTasks(updated);

  taskInput.value = "";
  taskInput.focus();
}

function handleListClick(event) {
  const target = event.target;
  const li = target.closest(".task-item");
  if (!li) return;

  const id = li.dataset.id;
  if (!id) return;

  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;

  if (target.closest(".task-checkbox")) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks(tasks);
    return;
  }

  if (target.closest(".icon-btn")) {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    renderTasks(updated);
    return;
  }
}

function init() {
  const tasks = loadTasks();
  renderTasks(tasks);

  addTaskBtn.addEventListener("click", addTaskFromInput);

  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTaskFromInput();
    }
  });

  taskList.addEventListener("click", handleListClick);
}

document.addEventListener("DOMContentLoaded", init);

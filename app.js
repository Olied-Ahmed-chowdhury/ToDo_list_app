/**
 * ============================================================
 * TaskFlow - Modern To-Do & Task Management Application
 * Clean, modular, and maintainable JavaScript (ES6)
 * ============================================================
 */

// ------------------------------------------------------------
// 1. Application State & Variables
// ------------------------------------------------------------
const STORAGE_KEY = 'taskflow_data_v2';
const THEME_KEY = 'taskflow_theme';

let tasks = [];
let currentFilter = 'all';
let currentSearch = '';
let currentCategoryFilter = 'all';
let currentSort = 'created-desc';

// DOM Elements: Header & Controls
const themeToggleBtn = document.getElementById('themeToggleBtn');
const exportBtn = document.getElementById('exportBtn');
const importFileInput = document.getElementById('importFileInput');
const currentDateDisplay = document.getElementById('currentDateDisplay');

// DOM Elements: Statistics
const totalTasksCount = document.getElementById('totalTasksCount');
const pendingTasksCount = document.getElementById('pendingTasksCount');
const completedTasksCount = document.getElementById('completedTasksCount');
const completionRateCount = document.getElementById('completionRateCount');
const progressBar = document.getElementById('progressBar');

// DOM Elements: Create Task Form
const addTaskForm = document.getElementById('addTaskForm');
const taskTitleInput = document.getElementById('taskTitleInput');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');

// DOM Elements: Search & Filters
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const segmentButtons = document.querySelectorAll('.segment-btn');
const categoryFilter = document.getElementById('categoryFilter');
const sortBySelect = document.getElementById('sortBySelect');

// DOM Elements: List & Empty State
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const emptyStateTitle = document.getElementById('emptyStateTitle');
const emptyStateDesc = document.getElementById('emptyStateDesc');
const activeTasksSummary = document.getElementById('activeTasksSummary');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// DOM Elements: Edit Modal
const editModal = document.getElementById('editModal');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskId = document.getElementById('editTaskId');
const editTaskTitle = document.getElementById('editTaskTitle');
const editPrioritySelect = document.getElementById('editPrioritySelect');
const editCategorySelect = document.getElementById('editCategorySelect');
const editDueDateInput = document.getElementById('editDueDateInput');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// DOM Elements: Toast Notification
const toastNotification = document.getElementById('toastNotification');

// ------------------------------------------------------------
// 2. Storage & Theme Initialization
// ------------------------------------------------------------
function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
  showToast(`Switched to ${nextTheme} theme`);
}

function loadTasks() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      tasks = JSON.parse(rawData);
    } else {
      // Backwards compatibility with old key if available
      const legacyData = localStorage.getItem('myTodoTasks');
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        tasks = parsed.map(item => ({
          id: item.id || Date.now(),
          title: item.text || item.title || 'Untitled task',
          completed: Boolean(item.done || item.completed),
          priority: 'medium',
          category: 'General',
          dueDate: '',
          createdAt: item.id || Date.now()
        }));
        saveTasks();
      } else {
        // Default onboarding tasks for first time users
        tasks = [
          {
            id: 1,
            title: 'Welcome to TaskFlow! Mark this task as completed.',
            completed: false,
            priority: 'medium',
            category: 'General',
            dueDate: getFormattedDate(0),
            createdAt: Date.now() - 3600000
          },
          {
            id: 2,
            title: 'Explore task priorities and custom categories.',
            completed: false,
            priority: 'high',
            category: 'Work',
            dueDate: getFormattedDate(1),
            createdAt: Date.now() - 7200000
          },
          {
            id: 3,
            title: 'Use search, filter, or export/import to backup your data.',
            completed: true,
            priority: 'low',
            category: 'Personal',
            dueDate: '',
            createdAt: Date.now() - 10800000
          }
        ];
        saveTasks();
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage', error);
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks', error);
    showToast('Storage error: Unable to save changes');
  }
}

// Helper: Returns YYYY-MM-DD for offset days
function getFormattedDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ------------------------------------------------------------
// 3. Rendering Logic
// ------------------------------------------------------------
function render() {
  // 1. Filter tasks
  let filtered = tasks.filter(task => {
    // Status filter
    if (currentFilter === 'active' && task.completed) return false;
    if (currentFilter === 'completed' && !task.completed) return false;

    // Category filter
    if (currentCategoryFilter !== 'all' && task.category !== currentCategoryFilter) {
      return false;
    }

    // Search query filter (title and category)
    if (currentSearch.trim() !== '') {
      const q = currentSearch.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }

    return true;
  });

  // 2. Sort tasks
  filtered.sort((a, b) => {
    switch (currentSort) {
      case 'created-asc':
        return a.createdAt - b.createdAt;
      case 'due-date':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      case 'priority': {
        const weight = { high: 3, medium: 2, low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'created-desc':
      default:
        return b.createdAt - a.createdAt;
    }
  });

  // 3. Render list items
  taskList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    if (currentSearch.trim() !== '' || currentCategoryFilter !== 'all' || currentFilter !== 'all') {
      emptyStateTitle.textContent = 'No matching tasks';
      emptyStateDesc.textContent = 'Try resetting your search query or filter options.';
    } else {
      emptyStateTitle.textContent = 'No tasks in your list';
      emptyStateDesc.textContent = 'Add your first task above to get started!';
    }
  } else {
    emptyState.classList.add('hidden');
    filtered.forEach(task => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  // 4. Update Statistics & Progress
  updateStatistics();
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.dataset.id = task.id;

  // Due date badge formatting
  let dueDateBadge = '';
  if (task.dueDate) {
    const today = getFormattedDate(0);
    const isOverdue = !task.completed && task.dueDate < today;
    const isToday = task.dueDate === today;
    
    let label = task.dueDate;
    let badgeClass = 'badge-date';
    if (isOverdue) {
      label = `Overdue: ${task.dueDate}`;
      badgeClass += ' overdue';
    } else if (isToday) {
      label = 'Due Today';
      badgeClass += ' today';
    } else {
      label = `Due: ${task.dueDate}`;
    }

    dueDateBadge = `<span class="${badgeClass}">${escapeHtml(label)}</span>`;
  }

  li.innerHTML = `
    <button type="button" class="task-checkbox-btn" aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
      <svg class="icon-svg-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>
    <div class="task-content">
      <div class="task-header-row">
        <span class="task-text">${escapeHtml(task.title)}</span>
      </div>
      <div class="task-meta-row">
        <span class="badge badge-priority-${task.priority}">${task.priority}</span>
        <span class="badge badge-category">${escapeHtml(task.category)}</span>
        ${dueDateBadge}
      </div>
    </div>
    <div class="task-actions">
      <button type="button" class="item-action-btn edit-btn" title="Edit task" aria-label="Edit task">
        <svg class="icon-svg-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button type="button" class="item-action-btn delete-btn" title="Delete task" aria-label="Delete task">
        <svg class="icon-svg-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `;

  // Attach event listeners
  const checkboxBtn = li.querySelector('.task-checkbox-btn');
  checkboxBtn.addEventListener('click', () => toggleTask(task.id));

  const editBtn = li.querySelector('.edit-btn');
  editBtn.addEventListener('click', () => openEditModal(task.id));

  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  return li;
}

function updateStatistics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasksCount.textContent = total;
  pendingTasksCount.textContent = pending;
  completedTasksCount.textContent = completed;
  completionRateCount.textContent = `${rate}%`;

  progressBar.style.width = `${rate}%`;
  activeTasksSummary.textContent = `${pending} item${pending === 1 ? '' : 's'} left`;
}

// ------------------------------------------------------------
// 4. Task Management Actions
// ------------------------------------------------------------
function addTask(title, priority, category, dueDate) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const newTask = {
    id: Date.now(),
    title: trimmed,
    completed: false,
    priority: priority || 'medium',
    category: category || 'General',
    dueDate: dueDate || '',
    createdAt: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();
  render();
  showToast('Task added successfully');
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
  showToast('Task deleted');
}

function clearCompleted() {
  const countBefore = tasks.length;
  tasks = tasks.filter(t => !t.completed);
  if (tasks.length < countBefore) {
    saveTasks();
    render();
    showToast('Completed tasks cleared');
  }
}

// ------------------------------------------------------------
// 5. Edit Modal Handling
// ------------------------------------------------------------
function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editTaskId.value = task.id;
  editTaskTitle.value = task.title;
  editPrioritySelect.value = task.priority;
  editCategorySelect.value = task.category;
  editDueDateInput.value = task.dueDate || '';

  editModal.classList.remove('hidden');
  editTaskTitle.focus();
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editTaskForm.reset();
}

editTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = Number(editTaskId.value);
  const task = tasks.find(t => t.id === id);

  if (task) {
    const titleVal = editTaskTitle.value.trim();
    if (!titleVal) return;

    task.title = titleVal;
    task.priority = editPrioritySelect.value;
    task.category = editCategorySelect.value;
    task.dueDate = editDueDateInput.value;

    saveTasks();
    render();
    closeEditModal();
    showToast('Task updated');
  }
});

closeEditModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);

// Close modal when clicking outside card
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// ------------------------------------------------------------
// 6. Search, Filter & Sort Event Handlers
// ------------------------------------------------------------
addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(
    taskTitleInput.value,
    prioritySelect.value,
    categorySelect.value,
    dueDateInput.value
  );

  taskTitleInput.value = '';
  dueDateInput.value = '';
  taskTitleInput.focus();
});

// Search input debounce/live filtering
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  if (currentSearch.length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  render();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  clearSearchBtn.classList.add('hidden');
  searchInput.focus();
  render();
});

// Status filter segmented buttons
segmentButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    segmentButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Category and Sort selectors
categoryFilter.addEventListener('change', (e) => {
  currentCategoryFilter = e.target.value;
  render();
});

sortBySelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  render();
});

clearCompletedBtn.addEventListener('click', clearCompleted);
themeToggleBtn.addEventListener('click', toggleTheme);

// ------------------------------------------------------------
// 7. Export & Import JSON
// ------------------------------------------------------------
exportBtn.addEventListener('click', () => {
  if (tasks.length === 0) {
    showToast('No tasks to export');
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `tasks_backup_${getFormattedDate(0)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Tasks exported to JSON');
});

importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      if (Array.isArray(importedData)) {
        // Validate each item
        const validTasks = importedData.map(item => ({
          id: item.id || Date.now() + Math.random(),
          title: String(item.title || item.text || 'Untitled task'),
          completed: Boolean(item.completed || item.done),
          priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
          category: String(item.category || 'General'),
          dueDate: item.dueDate || '',
          createdAt: item.createdAt || Date.now()
        }));

        tasks = validTasks;
        saveTasks();
        render();
        showToast(`Successfully imported ${validTasks.length} tasks`);
      } else {
        showToast('Invalid file format. JSON array expected.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error parsing JSON file');
    }
    importFileInput.value = '';
  };
  reader.readAsText(file);
});

// ------------------------------------------------------------
// 8. Utility Functions & Notifications
// ------------------------------------------------------------
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastNotification.textContent = message;
  toastNotification.classList.remove('hidden');

  toastTimeout = setTimeout(() => {
    toastNotification.classList.add('hidden');
  }, 2400);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateDateHeader() {
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  currentDateDisplay.textContent = now.toLocaleDateString(undefined, options);
}

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  // Press Escape to close modal
  if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
    closeEditModal();
  }
  // Press / to focus search
  if (e.key === '/' && document.activeElement !== searchInput && document.activeElement !== taskTitleInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

// ------------------------------------------------------------
// 9. App Bootstrapping
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadTasks();
  updateDateHeader();
  render();
});

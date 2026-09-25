// ============================================================
//  app.js  -  To-Do List App
//
//  How it works in plain English:
//    - We keep all tasks in a simple array called `tasks`
//    - When something changes (add/delete/toggle), we save
//      to localStorage and redraw the list from scratch
//    - localStorage means tasks survive a page refresh
// ============================================================


// ---- Grab the HTML elements we need ----
// Think of this as giving each element a nickname so we can
// refer to it easily throughout the code.

const addTaskForm  = document.getElementById('addTaskForm');   // the <form>
const taskInput    = document.getElementById('taskInput');     // text input
const taskList     = document.getElementById('taskList');      // the <ul>
const emptyState   = document.getElementById('emptyState');    // "No tasks" message
const clearDoneBtn = document.getElementById('clearDoneBtn');  // Clear Completed button

// Stats bar (the three numbers at the top)
const totalCountEl   = document.getElementById('totalCount');
const pendingCountEl = document.getElementById('pendingCount');
const doneCountEl    = document.getElementById('doneCount');

// All three filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');


// ---- App state ----
// tasks[]       holds every task as an object: { id, text, done }
// currentFilter tracks which tab is selected: 'all' | 'pending' | 'done'

let tasks         = [];
let currentFilter = 'all';


// ============================================================
//  STORAGE  -  save and load from the browser
// ============================================================

// Load any tasks that were saved in a previous session
function loadTasksFromStorage() {
  const saved = localStorage.getItem('myTodoTasks');
  if (saved) {
    // JSON.parse converts the stored text back into a JS array
    tasks = JSON.parse(saved);
  }
}

// Save the current tasks array to the browser's localStorage
function saveTasksToStorage() {
  // JSON.stringify converts the array to a plain text string for storage
  localStorage.setItem('myTodoTasks', JSON.stringify(tasks));
}


// ============================================================
//  RENDER  -  draw the task list on screen
//  We call this every time something changes.
// ============================================================

function renderTasks() {

  // Step 1: Work out which tasks to show based on the active filter
  let filteredTasks;

  if (currentFilter === 'all') {
    filteredTasks = tasks;
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.done);   // only incomplete
  } else {
    filteredTasks = tasks.filter(t => t.done);    // only completed
  }

  // Step 2: Remove all existing task rows from the list
  taskList.querySelectorAll('.task-item').forEach(item => item.remove());

  // Step 3: Show or hide the "no tasks" placeholder
  if (filteredTasks.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Step 4: Build and add a row for each task
  filteredTasks.forEach(task => {
    taskList.appendChild( buildTaskRow(task) );
  });

  // Step 5: Refresh the numbers in the stats bar
  updateStats();
}


// ============================================================
//  BUILD A TASK ROW
//  Creates one <li> element for a single task and returns it.
//  We keep this separate so renderTasks() stays easy to read.
// ============================================================

function buildTaskRow(task) {

  // Create the <li> wrapper
  const li = document.createElement('li');
  li.classList.add('task-item');
  li.dataset.id = task.id;         // store the ID so we can find it later

  if (task.done) {
    li.classList.add('done');      // adds strikethrough styling
  }

  // -- Checkbox button --
  // Clicking this toggles the task between done and not done
  const checkbox = document.createElement('button');
  checkbox.classList.add('task-checkbox');
  checkbox.setAttribute('aria-label', task.done ? 'Mark as pending' : 'Mark as done');
  checkbox.innerHTML = task.done ? '&#x2713;' : '';   // show a tick when done
  checkbox.addEventListener('click', () => toggleTask(task.id));

  // -- Task text --
  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = task.text;

  // -- Delete button --
  // Only visible when you hover over the row (controlled by CSS)
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '&#x2715;';   // the × symbol
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  // Put the pieces together and return the finished row
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}


// ============================================================
//  UPDATE STATS BAR
//  Counts total / done / pending and updates the three numbers.
// ============================================================

function updateStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;

  totalCountEl.textContent   = total;
  pendingCountEl.textContent = pending;
  doneCountEl.textContent    = done;
}


// ============================================================
//  ADD A TASK
// ============================================================

function addTask(text) {
  // Build a new task object
  const newTask = {
    id:   Date.now(),   // timestamp makes a unique ID
    text: text,
    done: false
  };

  // Add it to the front of the array so newest tasks appear first
  tasks.unshift(newTask);

  saveTasksToStorage();
  renderTasks();
}


// ============================================================
//  TOGGLE A TASK  (done ↔ not done)
// ============================================================

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;   // flip the boolean
    saveTasksToStorage();
    renderTasks();
  }
}


// ============================================================
//  DELETE A TASK
// ============================================================

function deleteTask(id) {
  // Keep every task except the one with the matching ID
  tasks = tasks.filter(t => t.id !== id);
  saveTasksToStorage();
  renderTasks();
}


// ============================================================
//  CLEAR COMPLETED TASKS
// ============================================================

function clearCompletedTasks() {
  // Keep only the tasks that are still pending
  tasks = tasks.filter(t => !t.done);
  saveTasksToStorage();
  renderTasks();
}


// ============================================================
//  EVENT LISTENERS
//  Connect user interactions to the functions above.
// ============================================================

// When the form is submitted (Enter key or clicking +)
addTaskForm.addEventListener('submit', function (event) {
  event.preventDefault();   // stop the page from refreshing

  const text = taskInput.value.trim();   // remove accidental whitespace
  if (text === '') return;              // do nothing if the input is empty

  addTask(text);
  taskInput.value = '';    // clear the input
  taskInput.focus();       // keep the cursor in the box for quick entry
});


// When a filter button is clicked
filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    currentFilter = this.dataset.filter;   // read 'all', 'pending', or 'done'

    // Move the active highlight to the clicked button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');

    renderTasks();
  });
});


// When the Clear Completed button is clicked
clearDoneBtn.addEventListener('click', clearCompletedTasks);


// ============================================================
//  START THE APP
//  These two lines run as soon as the page loads.
// ============================================================

loadTasksFromStorage();   // load any previously saved tasks
renderTasks();            // show them on screen

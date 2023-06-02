const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const apiUrl = 'https:/'/todolist.com/tasks';

// Function to fetch tasks from the API
async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

// Function to render tasks on the page
function renderTasks(tasks) {
  taskList.innerHTML = ''; // Clear the task list

  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-button">Delete</button>
      <button class="edit-button">Edit</button>
    `;

    const deleteButton = taskItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', async function() {
      try {
        await fetch(`${apiUrl}/${task.id}`, { method: 'DELETE' });
        taskList.removeChild(taskItem);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    });

    const editButton = taskItem.querySelector('.edit-button');
    const taskSpan = taskItem.querySelector('span');
    editButton.addEventListener('click', function() {
      const newTaskText = prompt('Enter a new task:', task.text);
      if (newTaskText !== null) {
        taskSpan.textContent = newTaskText;
        updateTask(task.id, newTaskText);
      }
    });

    taskList.appendChild(taskItem);
  });
}

// Function to update a task
async function updateTask(taskId, newText) {
  try {
    await fetch(`${apiUrl}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    });
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

// Function to add a new task
async function addTask() {
  const taskText = taskInput.value;
  if (taskText.trim() === '') {
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: taskText })
    });

    const newTask = await response.json();
    renderTasks(await fetchTasks()); // Refresh the task list
  } catch (error) {
    console.error('Error adding task:', error);
  }

  taskInput.value = '';
}

// Event listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Initial fetch and rendering of tasks
(async function() {
  const tasks = await fetchTasks();
  renderTasks(tasks);
})();

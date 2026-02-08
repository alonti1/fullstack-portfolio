
let tasks = [];
let currentFilter = "all";


const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const sortBtn = document.getElementById("sortBtn");




function getTasks() {
  const storedTasks = localStorage.getItem("tasks"); 
  if (storedTasks) {
    return JSON.parse(storedTasks); 
  } else {
    return []; 
  }
}


function saveTasks(tasksToSave) {
  localStorage.setItem("tasks", JSON.stringify(tasksToSave)); 
}




async function fetchInitialTasks() {
  
  if (getTasks().length > 0) return;

  try {
    
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5"
    );

    if (response.status === 200) {
      
      const data = await response.json();

      
      const apiTasks = data.map((item) => ({
        id: Date.now() + Math.random(), 
        text: item.title,
        dueDate: new Date().toISOString().split("T")[0], 
        completed: item.completed,
      }));

      tasks = apiTasks;
      saveTasks(tasks); 
      renderTasks(); 
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


function addTask() {
  const text = taskInput.value;
  const date = dateInput.value;

  
  if (text === "" || date === "") {
    alert("אנא מלא את כל השדות");
    return;
  }

  
  const newTask = {
    id: Date.now(),
    text: text, 
    dueDate: date, 
    completed: false, 
  };

  tasks.push(newTask); 
  saveTasks(tasks); 
  renderTasks(); 

  
  taskInput.value = "";
  dateInput.value = "";
}


function filterTasks(tasksArray, filter) {
  switch (
    filter 
  ) {
    case "completed":
      return tasksArray.filter((task) => task.completed); 
    case "active":
      return tasksArray.filter((task) => !task.completed); 
    case "all":
    default:
      return tasksArray; 
  }
}


function sortTasks() {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); 
  saveTasks(tasks);
  renderTasks();
}


function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}


function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
  }
}


function renderTasks() {
  taskList.innerHTML = ""; 

  
  const filteredTasks = filterTasks(tasks, currentFilter);

  
  filteredTasks.forEach((task) => {
    const li = document.createElement("li"); 

    
    if (task.completed) {
      li.classList.add("completed");
    }

    
    li.innerHTML = `
            <div class="task-info">
                <strong>${task.text}</strong>
                <small>${task.dueDate}</small>
            </div>
            <div class="actions">
                <button class="action-btn check-btn" data-id="${task.id}">✓</button>
                <button class="action-btn delete-btn" data-id="${task.id}">🗑️</button>
            </div>
        `;

    taskList.appendChild(li); 
  });

  
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      
      const id = Number(e.target.closest("button").dataset.id);
      deleteTask(id); 
    });
  });

  document.querySelectorAll(".check-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.closest("button").dataset.id);
      toggleComplete(id); 
    });
  });
}




addTaskBtn.addEventListener("click", addTask); 


sortBtn.addEventListener("click", sortTasks); 


document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    
    
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");

    
    if (e.target.id === "filterCompleted") currentFilter = "completed";
    else if (e.target.id === "filterActive") currentFilter = "active";
    else currentFilter = "all"; 

    renderTasks(); 
  });
});


window.addEventListener("load", () => {
  tasks = getTasks();
  if (tasks.length === 0) {
    fetchInitialTasks();
  } else {
    renderTasks();
  }
});

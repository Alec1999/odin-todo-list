class toDoItem {
    constructor(title, dueDate, description, priority, checklist) {
        this.title = title;
        this.dueDate = dueDate;
        this.description = description;
        this.priority = priority;
        this.checklist = checklist;
    }
}

const addToDoBtn = document.querySelector(".new-to-do");
let currentId = null;
const mainContent = document.querySelector(".main-content");
const toDoForm = document.querySelector("#to-do-form");

function initializeEventListeners() {
    mainContent.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");
    const toggleBtn = e.target.closest(".toggle-btn");

    let toDoItem = e.target.closest(".to-do-item");
    
    selectToDoItem(e, deleteBtn, editBtn, toggleBtn, toDoItem);
    });

    addToDoBtn.addEventListener("click", (e) => {
        showToDoForm();
    });

    toDoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!currentId) {
            createToDoItem();        
        } else {
            editToDoItem();
        }
    });
}

function createDefaultToDoItem() {
    let defaultToDoItem = new toDoItem("Default To-do Title", "Due date", "Description", "Priority", "Checklist");
    defaultToDoItem.id = crypto.randomUUID();
    addToDoItem(defaultToDoItem);
}

function showToDoForm(todoItem) {
    toDoForm.style.display = "block";
}

function createToDoItem() {
    const formData = new FormData(toDoForm);
    const data = Object.fromEntries(formData);

    resetToDoForm(toDoForm);
    addToDoItem(data);
}

function addToDoItem(formData) {
    const mainContent = document.querySelector(".main-content");
    let toDoArea = document.createElement("div");
    let toggleBtn = document.createElement("button");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    toggleBtn.classList.add("toggle-btn");
    editBtn.classList.add("edit-btn");
    deleteBtn.classList.add("delete-btn");

    renderIcons(toggleBtn, deleteBtn, toDoArea);

    let newToDo = new toDoItem(formData.title, formData.dueDate, formData.description, formData.priority, formData.checklist);
    newToDo.id = crypto.randomUUID(); 

    for (const [key, value] of Object.entries(newToDo)) {
        if (value != newToDo.id) {
            const toDoLineItem = document.createElement("div");
            toDoLineItem.classList.add(key);
            toDoLineItem.textContent = value;
            toDoArea.append(toDoLineItem);
        }
    }

    toDoArea.id = newToDo.id;
    toDoArea.append(toggleBtn);
    toDoArea.append(editBtn);
    toDoArea.append(deleteBtn);
    toDoArea.classList.add("to-do-item");
    
    mainContent.appendChild(toDoArea);
}

function selectToDoItem(e, deleteBtn, editBtn, toggleBtn, toDoItem) {
    if (toggleBtn) {
        toggleToDoItem(toDoItem);
    }

    if (editBtn) {
        currentId = toDoItem.id;
        showToDoForm(toDoItem);
    }

    if (deleteBtn) {
        if (confirm("Are you sure you want to delete this to-do item?")) {
            deleteToDoItem(toDoItem);
        }
    }
}

function renderIcons(toggleBtn, deleteBtn, toDoArea) {
    toggleBtn.innerHTML = 
        `<svg>
            <use href="#icon-uparrow"></use>
        </svg>`;

    deleteBtn.innerHTML = 
        `<svg>
            <use href="#icon-trashcan-closed"></use>
        </svg>`;
  
    deleteBtn.addEventListener("mouseenter", () => {
        if (!toDoArea.classList.contains("minimized")) {
            deleteBtn.innerHTML =
                `<svg>
                    <use href="#icon-trashcan-open"></use>
                </svg>`;
        }
    })

    deleteBtn.addEventListener("mouseleave", () => {
        if (!toDoArea.classList.contains("minimized")) {
            deleteBtn.innerHTML =
                `<svg>
                    <use href="#icon-trashcan-closed"></use>
                </svg>`;
        }
    })
}

function toggleToDoItem(toDoItem) {
    const toggleBtn = toDoItem.querySelector(".toggle-btn");
    const deleteBtn = toDoItem.querySelector(".delete-btn");

    toDoItem.classList.toggle("minimized");

    if (toDoItem.classList.contains("minimized")) {
        toggleBtn.innerHTML = 
            `<svg>
                <use href="#icon-downarrow"></use>
            </svg>`;
        
        deleteBtn.innerHTML = ' ';
    } else {
        toggleBtn.innerHTML = 
            `<svg>
                <use href="#icon-uparrow"></use>
            </svg>`;

        deleteBtn.innerHTML = `<svg>
            <use href="#icon-trashcan-closed"></use>
        </svg>`;
    }
}

function editToDoItem(toDoItem, id) {
    toDoForm.style.display = "none";
}

function deleteToDoItem(toDoItem) {
    toDoItem.remove();
}

function resetToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

createDefaultToDoItem();
initializeEventListeners();
selectToDoItem();
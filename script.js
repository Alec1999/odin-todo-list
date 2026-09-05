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
const todaysDate = getTodaysDate();
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
            editToDoItem(currentId);
        }
    });
}

function initializeRenderIcons(deleteBtn, toDoArea) {
    deleteBtn.addEventListener("mouseenter", updateTrashIcon)
    deleteBtn.addEventListener("mouseleave", updateTrashIcon)

    function updateTrashIcon(e) {
        if (!toDoArea.classList.contains("minimized")) {
            deleteBtn.innerHTML = e.type === "mouseenter" 
                ?   `<svg>
                        <use href="#icon-trashcan-open"></use>
                    </svg>`
                :    `<svg>
                        <use href="#icon-trashcan-closed"></use>
                    </svg>`;
        }
    }
}

function getTodaysDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {

    console.log(dateString);

    const [year, month, day] = dateString.split("-");

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString(undefined, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });
}

function createDefaultToDoItem() {
    let defaultToDoItem = new toDoItem("Default To-do Title", todaysDate, "Description", "Priority", "Checklist");
    defaultToDoItem.id = crypto.randomUUID();
    addToDoItem(defaultToDoItem);
}

function showToDoForm() {
    toDoForm.style.display = "block";
}

function createToDoItem() {
    const formData = new FormData(toDoForm);
    const data = Object.fromEntries(formData);

    resetToDoForm(toDoForm);
    addToDoItem(data);
}

function addToDoItem(formData) {
    let toDoArea = document.createElement("div");
    let toggleBtn = document.createElement("button");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    const dueDate = formData.dueDate;
    const formattedDate = formatDate(dueDate);

    toggleBtn.classList.add("toggle-btn");
    editBtn.classList.add("edit-btn");
    deleteBtn.classList.add("delete-btn");

    renderIcons(toggleBtn, deleteBtn);
    initializeRenderIcons(deleteBtn, toDoArea);

    let newToDo = new toDoItem(formData.title, formattedDate, formData.description, formData.priority, formData.checklist);
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
    toDoArea.append(deleteBtn);
    toDoArea.append(editBtn);
    toDoArea.append(toggleBtn);
    toDoArea.classList.add("to-do-item");
    
    mainContent.appendChild(toDoArea);
}

function selectToDoItem(e, deleteBtn, editBtn, toggleBtn, toDoItem) {
    if (toggleBtn) {
        toggleToDoItem(toDoItem);
    }

    if (editBtn) {
        currentId = toDoItem.id;
        showToDoForm();
        populateForm(currentId);
    }

    if (deleteBtn) {
        if (confirm("Are you sure you want to delete this to-do item?")) {
            deleteToDoItem(toDoItem);
        }
    }
}

function renderIcons(toggleBtn, deleteBtn) {
    toggleBtn.innerHTML = 
        `<svg>
            <use href="#icon-uparrow"></use>
        </svg>`;

    deleteBtn.innerHTML = 
        `<svg>
            <use href="#icon-trashcan-closed"></use>
        </svg>`;
}

function toggleToDoItem(toDoItem) {
    let toggleBtn = toDoItem.querySelector(".toggle-btn");
    let deleteBtn = toDoItem.querySelector(".delete-btn");

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

function populateForm(id) {
    const toDoItem = document.getElementById(id);

    const title = toDoItem.getElementsByClassName("title");
    const dueDate = toDoItem.getElementsByClassName("dueDate");
    const description = toDoItem.getElementsByClassName("description");
    const priority = toDoItem.getElementsByClassName("priority");
    const checklist = toDoItem.getElementsByClassName("checklist");

    toDoForm.elements["title"].value = title[0].textContent;
    toDoForm.elements["dueDate"].value = dueDate[0].textContent;
    toDoForm.elements["description"].value = description[0].textContent;
    toDoForm.elements["priority"].value = priority[0].textContent;
    toDoForm.elements["checklist"].value = checklist[0].textContent;
}

function editToDoItem(id) {
    const toDoItem = document.getElementById(id);

    const title = toDoItem.getElementsByClassName("title");
    const dueDate = toDoItem.getElementsByClassName("dueDate");
    const description = toDoItem.getElementsByClassName("description");
    const priority = toDoItem.getElementsByClassName("priority");
    const checklist = toDoItem.getElementsByClassName("checklist");

    title[0].textContent = toDoForm.elements["title"].value;
    dueDate[0].textContent = toDoForm.elements["dueDate"].value;
    description[0].textContent = toDoForm.elements["description"].value;
    priority[0].textContent = "Priority: " + toDoForm.elements["priority"].value;
    checklist[0].textContent = toDoForm.elements["checklist"].value;

    currentId = null;

    resetToDoForm(toDoForm);
}

function deleteToDoItem(toDoItem) {
    toDoItem.remove();
}

function resetToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

initializeEventListeners();
createDefaultToDoItem();
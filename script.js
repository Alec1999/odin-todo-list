// Make main content area- scrollable, whiule nav and footer stay stuck to bottom

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

    hideToDoForm(toDoForm);
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

    let newToDo = new toDoItem(formData.title, dueDate, formData.description, formData.priority, formData.checklist);
    newToDo.id = crypto.randomUUID(); 

    for (const [key, value] of Object.entries(newToDo)) {
        if (value != newToDo.id) {
            const toDoLineItem = document.createElement("div");
            toDoLineItem.classList.add(key);

            if (key === "dueDate") {
                toDoLineItem.textContent = formatDate(value)
            } else {
                toDoLineItem.textContent = value;
            }  
            toDoArea.append(toDoLineItem);
        }
    }

    toDoArea.id = newToDo.id;
    toDoArea.dataset.dueDate = newToDo.dueDate;
    toDoArea.dataset.priority = newToDo.priority;

    toDoArea.append(deleteBtn);
    toDoArea.append(editBtn);
    toDoArea.append(toggleBtn);
    toDoArea.classList.add("to-do-item");

    toggleToDoItem(toDoArea);
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

function getToDoElements(id) {
    const toDoItem = document.getElementById(id);

    return {
        toDoItem,
        title: toDoItem.getElementsByClassName("title")[0],
        dueDate: toDoItem.getElementsByClassName("dueDate")[0],
        description: toDoItem.getElementsByClassName("description")[0],
        priority: toDoItem.getElementsByClassName("priority")[0],
        checklist: toDoItem.getElementsByClassName("checklist")[0]
    }
}

function populateForm(id) {
    const { toDoItem, title, description, priority, checklist } = getToDoElements(id);

    toDoForm.elements["title"].value = title.textContent;
    toDoForm.elements["dueDate"].value = toDoItem.dataset.dueDate;
    toDoForm.elements["description"].value = description.textContent;
    toDoForm.elements["priority"].value = priority.textContent.split(" ")[1];
    toDoForm.elements["checklist"].value = checklist.textContent;
}

function editToDoItem(id) {
    const { title, dueDate, description, priority, checklist } = getToDoElements(id);
    const formattedDate = formatDate(toDoForm.elements["dueDate"].value);

    title.textContent = toDoForm.elements["title"].value;
    dueDate.textContent = formattedDate;
    description.textContent = toDoForm.elements["description"].value;
    priority.textContent = "Priority: " + toDoForm.elements["priority"].value;
    checklist.textContent = toDoForm.elements["checklist"].value;

    currentId = null;
    hideToDoForm(toDoForm);
    resetToDoForm(toDoForm);
}

function deleteToDoItem(toDoItem) {
    toDoItem.remove();
}

function resetToDoForm(toDoForm) {
    toDoForm.elements["title"].value = "";
    toDoForm.elements["dueDate"].value = "";
    toDoForm.elements["description"].value = "";
    toDoForm.elements["checklist"].value = "";

    toDoForm.querySelectorAll('input[name="priority"]').forEach(radio => {
        radio.checked = false;
    });
}

function hideToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

function loopDefaultStart() {
    for (i = 0; i < 30; i++) {
        createDefaultToDoItem()
    }
}

initializeEventListeners();
createDefaultToDoItem();
loopDefaultStart();
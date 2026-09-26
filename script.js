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
const toDoItems = [];

function initializeEventListeners() {
    mainContent.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        const editBtn = e.target.closest(".edit-btn");
        const toggleBtn = e.target.closest(".toggle-btn");
        const toDoItem = e.target.closest(".to-do-item");
        
        selectToDoItem(deleteBtn, editBtn, toggleBtn, toDoItem);
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

function initializeRenderIcons(deleteBtn, editBtn, toDoArea) {
    deleteBtn.addEventListener("mouseenter", updateTrashIcon)
    deleteBtn.addEventListener("mouseleave", updateTrashIcon)

    editBtn.addEventListener("mouseenter", updatePencilIcon)
    editBtn.addEventListener("mouseleave", updatePencilIcon)

    function updatePencilIcon(e) {
        if (!toDoArea.classList.contains("minimized")) {
            editBtn.innerHTML = e.type === "mouseenter" 
                ?   `<svg>
                        <use href="#icon-pencil"></use>
                    </svg>`
                :    `<svg>
                        <use href="#icon-pencil-outline"></use>
                    </svg>`;

            editBtn.querySelector("svg").classList.toggle("enlarge", e.type === "mouseenter");
        }
    }

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
    let defaultToDoItem = new toDoItem("Default To-do Title", todaysDate, "Description", "Priority: High", "Item 1, Item 2, Item 3");
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
    const toDoArea = document.createElement("div");
    const buttonContainer = document.createElement("div");
    const toggleBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const dueDate = formData.dueDate;

    toggleBtn.classList.add("toggle-btn");
    editBtn.classList.add("edit-btn");
    deleteBtn.classList.add("delete-btn");
    buttonContainer.classList.add("button-container");

    renderIcons(toggleBtn, editBtn, deleteBtn);
    initializeRenderIcons(deleteBtn, editBtn, toDoArea);

    const newToDo = new toDoItem(formData.title, dueDate, formData.description, formData.priority, formData.checklist);
    newToDo.id = crypto.randomUUID(); 

    for (const [key, value] of Object.entries(newToDo)) {
        if (value != newToDo.id) {

            if (key === "checklist") {
                const checklistData = value.split(",").map(item => ({
                    text: item.trim(),
                    checked: false
                }));

                toDoArea.append(renderCheckList(checklistData));
                continue;
            }

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

    buttonContainer.append(editBtn, toggleBtn)

    toDoArea.id = newToDo.id;
    toDoArea.dataset.dueDate = newToDo.dueDate;
    toDoArea.dataset.priority = newToDo.priority;

    toDoArea.append(buttonContainer, deleteBtn);
    toDoArea.classList.add("to-do-item");

    toggleToDoItem(toDoArea);
    mainContent.appendChild(toDoArea);

    toDoItems.push(newToDo);
    resetToDoForm(toDoForm);
}

function selectToDoItem(deleteBtn, editBtn, toggleBtn, toDoItem) {
    if (toggleBtn) {
        toggleToDoItem(toDoItem);
    }

    if (!toDoItem.classList.contains("minimized")) {
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

}

function renderIcons(toggleBtn, editBtn, deleteBtn) {
    toggleBtn.innerHTML = 
        `<svg>
            <use href="#icon-uparrow"></use>
        </svg>`;

    editBtn.innerHTML =
        `<svg>
            <use href="#icon-pencil-outline"></use>
        </svg>`;

    deleteBtn.innerHTML = 
        `<svg>
            <use href="#icon-trashcan-closed"></use>
        </svg>`;
}

function toggleToDoItem(toDoItem) {
    let toggleBtn = toDoItem.querySelector(".toggle-btn");
    let editBtn = toDoItem.querySelector(".edit-btn");
    let deleteBtn = toDoItem.querySelector(".delete-btn");

    toDoItem.classList.toggle("minimized");

    if (toDoItem.classList.contains("minimized")) {
        toggleBtn.innerHTML = 
            `<svg>
                <use href="#icon-downarrow"></use>
            </svg>`;
        
        editBtn.innerHTML = ' ';
        deleteBtn.innerHTML = ' ';
    } else {
        toggleBtn.innerHTML = 
            `<svg>
                <use href="#icon-uparrow"></use>
            </svg>`;

        editBtn.innerHTML = `<svg>
            <use href="#icon-pencil-outline"></use>
        </svg>`;    

        deleteBtn.innerHTML = `<svg>
            <use href="#icon-trashcan-closed"></use>
        </svg>`;
    }
}

function renderCheckList(checklistData) {
    const checklistContainer = document.createElement("div");
    checklistContainer.classList.add("checklist");

    checklistData.forEach((item, index) => {
        const label = document.createElement("label");
        label.classList.add("checklist-item");

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox";
        checkbox.checked = item.checked;
        checkbox.dataset.index = index;

        const text = document.createElement("span");
        text.textContent = item.text;

        label.append(checkbox, text);
        checklistContainer.appendChild(label);
    });

    return checklistContainer;
}

function getChecklistData(checklist, checklistString) {
    const checkListItems = checklist.querySelectorAll(".checklist-item");

    const oldItems = Array.from(checkListItems).map(item => {
        return {
            text: item.querySelector("span").textContent,
            checked: item.querySelector("input").checked
        };
    });

    const newItems = checklistString.split(",");

    return newItems.map(item => {
        const text = item.trim();

        const oldItem = oldItems.find(oldItem => oldItem.text === text);

        return {
            text: text,
            checked: oldItem ? oldItem.checked : false
        };
    });
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

    const checklistItems = checklist.querySelectorAll(".checklist-item");
    const checklistText = [];

    checklistItems.forEach(item => {
        const text = item.querySelector("span")
        checklistText.push(text.textContent);
    });

    toDoForm.elements["checklist"].value = checklistText.join(",");
}

function editToDoItem(id) {
    const { toDoItem, title, dueDate, description, priority, checklist } = getToDoElements(id);
    const formattedDate = formatDate(toDoForm.elements["dueDate"].value);

    const checklistString = toDoForm.elements["checklist"].value;
    const checklistData = getChecklistData(checklist, checklistString);
    const currentItem = toDoItems.find((toDo) => toDo.id === id); 

    title.textContent = toDoForm.elements["title"].value;
    dueDate.textContent = formattedDate;
    description.textContent = toDoForm.elements["description"].value;
    priority.textContent = "Priority: " + toDoForm.elements["priority"].value;

    currentItem.checklist = checklistData;
    checklist.replaceWith(renderCheckList(checklistData));

    currentId = null;
    hideToDoForm(toDoForm);
    resetToDoForm(toDoForm);
}

function deleteToDoItem(toDoItem) {
    for (let i = 0; i < toDoItems.length; i++) {
        if (toDoItems[i].id == toDoItem.id) {
            toDoItems.splice(i, 1);
            break;
        } 
    }

    toDoItem.remove();
    hideToDoForm(toDoForm);
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

initializeEventListeners();
createDefaultToDoItem();
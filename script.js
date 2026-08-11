class toDoItem {
    constructor(title, description, dueDate, priority, checklist) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }
}

function createDefaultToDoItem() {
    let defaultToDoItem = new toDoItem("Default To-do Title",  "Description", "Due date", "Priority", "Checklist");
    defaultToDoItem.id = crypto.randomUUID();
    addToDoItem(defaultToDoItem);
}

function createToDoItem() {
    let addToDoBtn = document.querySelector(".new-to-do");
    let toDoForm = document.querySelector("#to-do-form");

    addToDoBtn.addEventListener("click", (e) => {
        toDoForm.style.display = "block";
    });

    toDoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(toDoForm);
        const data = Object.fromEntries(formData);

        resetToDoForm(toDoForm);
        addToDoItem(data);
    });
}

function addToDoItem(formData) {
    const mainContent = document.querySelector(".main-content");
    let toDoArea = document.createElement("div");
    let toggleBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    toggleBtn.classList.add("toggle-btn");
    deleteBtn.classList.add("delete-btn");

    toggleBtn.innerHTML = 
                `<svg>
                    <use href="#icon-uparrow"></use>
                </svg>`;

    deleteBtn.innerHTML = 
                `<svg>
                    <use href="#icon-trashcan-closed"></use>
                </svg>`;

    let newToDo = new toDoItem(formData.title, formData.description, formData.dueDate, formData.priority, formData.checklist);
    newToDo.id = crypto.randomUUID(); 

    for (const [key, value] of Object.entries(newToDo)) {

        if (value != newToDo.id) {
            const toDoLineItem = document.createElement("div");
            toDoLineItem.textContent = value;
            toDoLineItem.classList.add(key);
            toDoArea.append(toDoLineItem);
        }
    }

    toDoArea.append(toggleBtn);
    toDoArea.append(deleteBtn);
    toDoArea.classList.add("to-do-item");
    
    mainContent.appendChild(toDoArea);
}

function selectToDoItem() {
    const mainContent = document.querySelector(".main-content");

    mainContent.addEventListener("click", (e) => {
        const toggleBtn = e.target.closest(".toggle-btn");
        const deleteBtn = e.target.closest(".delete-btn");

        if (toggleBtn) {
            let toDoItem = e.target.closest(".to-do-item");
            toggleToDoItem(toDoItem);
        }

        if (deleteBtn) {
            let toDoItem = e.target.closest(".to-do-item");
            deleteToDoItem(toDoItem);
        }
    });
}

function toggleToDoItem(toDoItem) {
    const toggleBtn = toDoItem.querySelector(".toggle-btn");

    toDoItem.classList.toggle("minimized");

    if (toDoItem.classList.contains("minimized")) {
        toggleBtn.innerHTML = 
            `<svg>
                <use href="#icon-downarrow"></use>
            </svg>`;
    } else {
        toggleBtn.innerHTML = 
            `<svg>
                <use href="#icon-uparrow"></use>
            </svg>`;
    }
}

function deleteToDoItem(toDoItem) {
    toDoItem.remove();
}

function resetToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

createDefaultToDoItem();
createToDoItem();
selectToDoItem();
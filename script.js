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
    toggleBtn.textContent = "✏️";
    toggleBtn.classList.add("toggle-btn");

    let newToDo = new toDoItem(formData.title, formData.description, formData.dueDate, formData.priority, formData.checklist);
    newToDo.id = crypto.randomUUID(); 

    for (const value of Object.values(newToDo)) {
        if (value) {
            const toDoLineItem = document.createElement("div");
            toDoLineItem.textContent = value;
            toDoArea.append(toDoLineItem);
        }
    }

    toDoArea.append(toggleBtn);
    toDoArea.classList.add("to-do-item");
    
    mainContent.appendChild(toDoArea);
}

function selectToDoItem() {
    const mainContent = document.querySelector(".main-content");

    mainContent.addEventListener("click", (e) => {
        if (e.target.classList.contains("toggle-btn")) {
            let toDoItem = e.target.closest(".to-do-item");
            toggleToDoItem(toDoItem);
        }
    });
}

function toggleToDoItem(toDoItem) {
    toDoItem.classList.toggle("minimized");
}

function resetToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

createDefaultToDoItem();
createToDoItem();
selectToDoItem();
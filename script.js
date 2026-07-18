class toDoItem {
    constructor(title, description, dueDate, priority, checklist) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }
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
        
        console.log(data);
    });
}

function addToDoItem(formData) {
    const mainContent = document.querySelector(".main-content");
    let toDoArea = document.createElement("div");

    let newToDo = new toDoItem(formData.title, formData.description, formData.dueDate, formData.priority, formData.checklist);

    console.log("Due date is " + newToDo.dueDate);

    for (const value of Object.values(newToDo)) {
        console.log("Value is " + value);
        toDoArea.append(value + ", ");
    };

    toDoArea.classList.add("to-do-item");
    mainContent.appendChild(toDoArea);
}

function resetToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

createToDoItem();
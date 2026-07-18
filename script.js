class toDoItem {
    constructor(title, description, dueDate, priority, checklist) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }
}

function CreateToDoItem() {
    let addToDoBtn = document.querySelector(".new-to-do");
    let toDoForm = document.querySelector("#to-do-form");
    addToDoBtn.addEventListener("click", (e) => {
        toDoForm.style.display = "block";
    });
    let newItem = new toDoItem("clean", "Finish the dishes, and the laundry", "Monday", "High", "Checklist goes here")
    console.log(newItem);
    addToDoItem(newItem);
};

function addToDoItem(toDoItem) {
    const mainContent = document.querySelector(".main-content");
    let toDoArea = document.createElement("div");
    toDoArea.textContent = "New to do list!";
    toDoArea.classList.add("to-do-item");
    mainContent.appendChild(toDoArea);
}

CreateToDoItem();
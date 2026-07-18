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
        event.preventDefault();

        const formData = new FormData(toDoForm);
        const data = Object.fromEntries(formData);

        resetToDoForm(toDoForm);
        testAddToDoItem(data);
        
        console.log(data);
    });
}

function addToDoItem(toDoItem) {
    const mainContent = document.querySelector(".main-content");
    let toDoArea = document.createElement("div");
    toDoArea.textContent = "New to do list!";
    toDoArea.classList.add("to-do-item");
    mainContent.appendChild(toDoArea);
}

function resetToDoForm(toDoForm) {
    toDoForm.style.display = "none";
}

createToDoItem();

function testAddToDoItem(formData) {
    const mainContent = document.querySelector(".main-content");
    let toDoArea = document.createElement("div");
    
    let newToDo = new toDoItem("clean", "Finish the dishes", "Monday", "High", "Checklist goes here");

    let itemTitle = newToDo.title;
    let itemDescription = newToDo.description;
    let itemDueDate = newToDo.dueDate;
    let itemPriority = newToDo.priority;
    let itemCheckList = newToDo.checklist;

    toDoArea.append(itemTitle, ", ", itemDescription, ", ", itemDueDate, ", ", itemPriority, ", ", itemCheckList);
    toDoArea.classList.add("to-do-item");
    mainContent.appendChild(toDoArea);

}

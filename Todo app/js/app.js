const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const tBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const editButton = document.getElementById("edit-button");
const filterButton = document.querySelectorAll(".filter-todos")

let todos = JSON.parse(localStorage.getItem("todos")) || [] ;
console.log(todos)

const generateId = () =>{
    return Math.round(Math.random()*Math.random()*Math.pow(10 , 15)).toString();
};

const saveToLocalStorage = () =>{
    localStorage.setItem("todos" , JSON.stringify(todos));
};

const showAlert = (message , type) =>{
    alertMessage.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerHTML = message;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMessage.append(alert);

    setTimeout(() =>{
        alert.style.display = "none"
    },2000)
};

const displayTodos = (data) =>{
    const todoList = data || todos;
    tBody.innerHTML = "";
    if(!todoList.length){
        tBody.innerHTML = "<tr><td colspan='4'>No task found!</td></tr>";
        return
    };

    todoList.forEach(todo => {
        tBody.innerHTML +=`
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "No date"}</td>
            <td>${todo.completed ? "completed" : "pending"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">Edit</button>
                <button onclick="toggleHandler('${todo.id}')">${todo.completed?"Undo ": "DO"}</button>
                <button onclick="deleteHandler('${todo.id}')">Delete</button>
            </td>
        </tr>
        `
    });
};


const addHandler = () =>{
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id : generateId(),
        task : task ,
        date : date , 
        completed : false
    };
    if(task){
        todos.push(todo);
        saveToLocalStorage();
        displayTodos();
        taskInput.value = "";
        dateInput.value = "";
        showAlert("todo added successfully" , "success");
    }else{
        showAlert("please enter a todo!" , "error");
    }

}

const deletAllHandler = () =>{
    if(todos.length){
        todos = [];
        saveToLocalStorage();
        displayTodos();
        showAlert("All todos cleared successfully" , "success");
    }else{
        showAlert("No todos to clear" , "error");
    }
};

const deleteHandler = (id) =>{
    const newTodos = todos.filter((todo)=> todo.id !== id);
    todos = newTodos ;
    saveToLocalStorage();
    displayTodos();
    showAlert("todo deleted successfully" , "success");
};

const toggleHandler = (id) =>{
    const todo = todos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    saveToLocalStorage();
    displayTodos();
    showAlert("todo status changed successfully" , "success");
};

const editHandler = (id) =>{
    const todo = todos.find((todo)=>todo.id === id);
    taskInput.value = todo.task;
    dateInput.value = todo.date;
    addButton.style.display = "none";
    editButton.style.display = "inline-block";
    editButton.dataset.id = id;
};

const editTodoHandler = (event) =>{
    const id = event.target.dataset.id;
    const todo = todos.find((todo)=>todo.id === id);
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    taskInput = "";
    dateInput = "";
    addButton.style.display = "inline-block";
    editButton.style.display = "none";
    saveToLocalStorage();
    displayTodos();
    showAlert("todos edit successfully" , "success");
};

const filterHandler = (event) =>{
    let filterTodos = null;
    const filter = event.target.dataset.filter;
    switch (filter) {
        case "pending":
            filterTodos = todos.filter((todo) => todo.completed === false);
            break;
        case "completed":
            filterTodos = todos.filter((todo) => todo.completed === true);
            break;

        default:
            filterTodos = todos;
            break;
    }

    displayTodos(filterTodos)
};

window.addEventListener("load" , ()=>displayTodos());
addButton.addEventListener("click" , addHandler);
deleteAllButton.addEventListener("click" , deletAllHandler);
editButton.addEventListener("click" , editTodoHandler);
filterButton.forEach((button) =>{
    button.addEventListener("click" , filterHandler)
});
const todosEl = document.querySelector(".todos");
const addBtn = document.querySelector(".add-btn");
const textInputEl = document.querySelector(".text-input");

const initializeAllBtnsEventListeners = () => {
  const doneBtns = document.querySelectorAll(".done");

  doneBtns.forEach((doneBtn) => {
    doneBtn.addEventListener("click", (e) => {
      updateTodo(e.target);
    });
  });
};

function initialize() {
  let localData = getLocalData();
  if (typeof localData === "Array" && localData.length > 0) {
    localData.forEach(({ todo, done }) => addToTodoHtml(todo, done));
  }
  initializeAllBtnsEventListeners();
}

textInputEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addBtn.click();
});

const addToTodoHtml = ({ todo, done }) => {
  todosEl.innerHTML += `<div class="todo-item" data-done="${done}">
    <span class="todo-title">${todo}</span>
    <div class="buttons">
      <button class="edit">Edit</button>
      <button class="done">Done</button>
    </div>
  </div>`;
};

const getLocalData = () => {
  let data = JSON.parse(localStorage.getItem("todoApp"));
  if (!data) {
    console.warn("No data found in local storage!");
    console.log("Initializing storage...");
    localStorage.setItem("todoApp", "{}");
    //TODO: I'm thinking of moving the todo functionality to it's own class
  }
  return data?.length ? data : [data];
};

const saveToLocalData = ({ todo, done }) => {
  let data = getLocalData();
  if (typeof data !== "Array" && !data.length) {
    let answer = confirm("Do you want to reset todo data ?");
    if (answer === true) {
      localStorage.setItem("todoApp", "{}");
    } else {
      console.warn(
        "Not resetting the todo local data will cause the app to malfunction!"
      );
      return;
    }
  }

  if (typeof data === "Array" && data.length > 0) {
    data.push({ todo, done });
  }

  localStorage.setItem("todoApp", JSON.stringify(data));
  console.log("Called!");
};

initialize();

addBtn.addEventListener("click", () => {
  let todo = textInputEl.value;
  if (!todo.length) {
    alert("Please Input a valid String");
    return;
  }

  let todoData = { todo, done: false };

  saveToLocalData(todoData);
  textInputEl.value = "";
  addToTodoHtml(todoData);
  initializeAllBtnsEventListeners();
});

function updateTodo(el) {
  let parentEl = el.parentNode.parentNode;

  if (!parentEl) {
    return;
  }

  let isDone = parentEl.dataset.done;
  let todo = parentEl.firstElementChild.textContent;
  if (isDone === "false") {
    parentEl.dataset.done = true;
  } else {
    parentEl.dataset.done = false;
  }

  let done = isDone === "false" ? false : true;
  saveToLocalData({ todo, done });
}

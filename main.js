const body = document.body;
const input = document.getElementById("input");
const addButton = document.getElementById("add");
const list = document.getElementById("list");

let todoList = [];

async function fetchTodoList() {
  todoList = await fetch("https://jsonplaceholder.typicode.com/todos")
    .then((res) => res.json())
    .then((data) => data);
  render(todoList);
}
fetchTodoList();

function render(todoList) {
  for (let i = 0; i < todoList.length; i++) {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const removeButton = document.createElement("button");
    checkbox.type = "checkbox";
    checkbox.checked = todoList[i].completed;
    removeButton.textContent = "x";
    li.classList.add("list_item");
    removeButton.classList.add("remove-btn");
    li.id = `${todoList[i].id}`;
    li.textContent = `${todoList[i].title}`;
    li.append(removeButton);
    li.prepend(checkbox);

    todoList[i].completed
      ? (checkbox.parentElement.style.background = "red")
      : (checkbox.parentElement.style.background = "");

    list.prepend(li);

    checkbox.addEventListener("click", () => {
      checkboxEdit(i);
    });
    removeButton.addEventListener("click", () => {
      removeTodo(i);
    });
  }
}

addButton.addEventListener("click", async () => {
  if (input.value === "") return;

  const todo = {
    title: input.value,
    completed: false,
  };

  list.innerHTML = "";
  const status = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(todo),
  })
    .then(({ status }) => status)
    .catch((e) => {
      console.log(e);
    });
  if (status === 201) {
    todoList.push(todo);
    input.value = "";
    render(todoList);
  }
});

async function checkboxEdit(i) {
  const status = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoList[i].id}`,
    {
      method: "PATCH",
      headers: { "Content-type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        completed: (todoList[i].completed = !todoList[i].completed),
      }),
    }
  )
    .then(({ status }) => status)
    .catch((e) => {
      console.log(e);
    });
  console.log(status);
  if (status === 200) {
    render(todoList);
  }
}

async function removeTodo(i) {
  const status = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoList[i].id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
    }
  )
    .then(({ status }) => status)
    .catch((e) => {
      console.log(e);
    });
  if (status === 200) {
    todoList.splice(i, 1);
    render(todoList);
  }
}

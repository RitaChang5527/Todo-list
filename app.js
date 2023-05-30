let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  console.log(e.target);
  e.preventDefault();

  //get input value

  let form = e.target.parentElement;
  let myEvent = form.children[0].value;
  let myMonth = form.children[1].value;
  let myDate = form.children[2].value;

  if (myEvent == "") {
    alert("Please enter something here");
    return;
  }

  //create a todo object
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = myEvent;

  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = myMonth + "/" + myDate;
  todo.appendChild(text);
  todo.appendChild(time);

  //create check and trash can
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class= "fas fa-check"><i>';
  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class= "fas fa-trash"><i>';
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  //todo animation
  todo.style.animation = "scaleUp 0.3s forwards";

  //create on objects
  let myTodo = {
    myEvent: myEvent,
    myMonth: myMonth,
    myDate: myDate,
  };

  //store data into an array of objects
  let myList = localStorage.getItem("list");
  if (myList === null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  //console.log(JSON.parse(localStorage.getItem("list")));

  form.children[0].value = ""; //clear the text input
  section.appendChild(todo);
});

loadDate();

function loadDate() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      //create todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.myEvent;

      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.myMonth + "/" + item.myDate;
      todo.appendChild(text);
      todo.appendChild(time);

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class= "fas fa-check"><i>';
      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class= "fas fa-trash"><i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
          //remove from localStorage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.myEvent == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].myMonth) > Number(arr2[j].myMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].myMonth) <Number( arr2[j].myMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].myMonth) == Number(arr2[j].myMonth)) {
      if (arr1[i].myDate > arr2[j].myDate) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length/2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  loadDate();
});

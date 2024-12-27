// 定義task資料，如果local中有資料就抓取，如果沒有則為空陣列
let taskListArray = JSON.parse(localStorage.getItem('taskListArray')) || [];

// 定義任務列表的 DOM 元素
const allItem = document.getElementById('task-list');
const agentItem = document.getElementById('task-list-agent');
const finishItem = document.getElementById('task-list-finish');

// 建立目前尚無代辦事項的 li 元素
const noTaskLi = document.createElement('li');
noTaskLi.className = 'list-group-item d-flex justify-content-between align-items-center';
noTaskLi.innerText = '目前尚無代辦事項';
allItem.appendChild(noTaskLi); // 預設顯示該li

// 如果任務列表是空的就顯示無代辦，會從其他動作中調用
function updateNoTaskClass() {
    if (taskListArray.length === 0) {
        if (!document.contains(noTaskLi)) {
            allItem.appendChild(noTaskLi);
        }
    } else {
        if (document.contains(noTaskLi)) {
            noTaskLi.remove();
        }
    }
}
  // 將 taskListArray 保存到 localStorage，會從其他動作中調用
  function saveToLocalStorage() {
      localStorage.setItem('taskListArray', JSON.stringify(taskListArray));
      console.table(taskListArray.map(task => ({
          text: task.text,
          completed: task.completed,
          index: taskListArray.indexOf(task)
      })));
  };

// 設定任務清單的li顯示，會從其他動作中調用
function createListItem() {
    const listItem = document.createElement('li'); // 新增li
    const listItemText = document.createElement('p'); // 新增P內容
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center'; // 設定li的class
    listItemText.className = 'flex-grow-1 mx-2';
    return { listItem, listItemText };
}

// 建立狀態標籤，會從其他動作中調用
function createStatusSpan(status) {
    const statusSpan = document.createElement('span');
    statusSpan.className = status ? 'badge bg-success mx-2' : 'badge bg-warning text-dark mx-2';
    statusSpan.innerText = status ? '已完成' : '待完成';
    return statusSpan;
}

// 建立刪除按鈕，會從其他動作中調用
function createDelBtn(listItem, taskText) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-sm mx-2';
    delBtn.innerText = '刪除';
    delBtn.addEventListener('click', function () {
        const index = taskListArray.findIndex(item => item.text === taskText);
        if (index > -1) {
            taskListArray.splice(index, 1);
            saveToLocalStorage();
            loadAllTasks();
        }
    });
    return delBtn;
}

// 建立核取方塊，會從其他動作中調用
function createCheckBox(listItem, statusSpan, taskText) {
    const checkBox = document.createElement('input');
    checkBox.className = 'form-check-input';
    checkBox.setAttribute("type", "checkbox");
    const index = taskListArray.findIndex(item => item.text === taskText);
    if (index > -1) {
        checkBox.checked = taskListArray[index].completed;
    }
    
    checkBox.addEventListener('change', function () {
        const index = taskListArray.findIndex(item => item.text === taskText);
        if (index > -1) {
            taskListArray[index].completed = checkBox.checked;
            statusSpan.innerText = checkBox.checked ? '已完成' : '待完成';
            statusSpan.className = checkBox.checked ? 'badge bg-success mx-2' : 'badge bg-warning text-dark mx-2';
            saveToLocalStorage();
            loadAllTasks();
        }
    });
    return checkBox;
}

// 建立修改按鈕，會從其他動作中調用
function createUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn, taskText) {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-info btn-sm mx-2';
    updateBtn.innerText = '修改';
    
    updateBtn.addEventListener('click', function () {
        const todoUpdate = document.createElement('input');
        todoUpdate.className = 'form-control';
        todoUpdate.value = listItemText.innerText;

        const updateCheck = document.createElement('button');
        updateCheck.className = 'btn btn-info btn-sm mx-2';
        updateCheck.innerText = '確定修改';
        
        listItem.innerHTML = '';
        listItem.appendChild(todoUpdate);
        listItem.appendChild(updateCheck);

        updateCheck.addEventListener('click', function () {
            const newText = todoUpdate.value;
            if (newText) {
                const index = taskListArray.findIndex(item => item.text === taskText);
                if (index > -1) {
                    taskListArray[index].text = newText;
                    saveToLocalStorage();
                    loadAllTasks();
                    console.log('修改任務:', {
                        text: taskListArray[index].text,
                        index: index
                    });
                }
            }
        });
    });
    return updateBtn;
}

// 將任務項目添加到DOM，會從其他動作中調用
function addTaskToDOM(parentElement, listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn) {
    listItem.appendChild(checkBox);
    listItem.appendChild(statusSpan);
    listItem.appendChild(listItemText);
    listItem.appendChild(updateBtn);
    listItem.appendChild(delBtn);
    parentElement.appendChild(listItem);
}

// 加載任務項目
function loadTasks(filterFn, parentElement) {
    parentElement.innerHTML = '';
    const tasks = filterFn ? taskListArray.filter(filterFn) : taskListArray;
    
    tasks.forEach(task => {
        const { listItem, listItemText } = createListItem();
        listItemText.innerText = task.text;

        const statusSpan = createStatusSpan(task.completed);
        const checkBox = createCheckBox(listItem, statusSpan, task.text);
        const delBtn = createDelBtn(listItem, task.text);
        const updateBtn = createUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn, task.text);

        addTaskToDOM(parentElement, listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn);
    });
    updateNoTaskClass();
}

// 加載local資料顯示在列表，在本段最結尾調用
function loadAllTasks() {
    loadTasks(null, allItem);
    loadTasks(task => !task.completed, agentItem);
    loadTasks(task => task.completed, finishItem);
}

// 當點擊新增按鈕時，創建一個新的任務
document.getElementById('todoCreateBtn').addEventListener('click', function () {
    const taskInput = document.getElementById('todoCreate');
    const taskText = taskInput.value;
    if (taskText) { // 如果輸入框有寫東西
        const { listItem, listItemText } = createListItem(); // 設定任務清單的li
        listItemText.innerText = taskText; // 從輸入框獲得資料寫入

        const statusSpan = createStatusSpan(false); // 設定狀態標籤
        const checkBox = createCheckBox(listItem, statusSpan); // 設定勾選鈕
        const delBtn = createDelBtn(listItem); // 設定刪除鈕
        const updateBtn = createUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn); // 設定更新鈕

        addTaskToDOM(allItem, listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去

        taskListArray.push({ text: taskText, completed: false, element: listItem, textElement: listItemText }); // 將資料存到陣列
        taskInput.value = ''; // 將輸入框清空
        updateNoTaskClass();
        saveToLocalStorage(); // 更新 localStorage
    }
});

// 設定標籤點擊事件，根據點擊的標籤顯示不同的任務列表
document.querySelectorAll('.nav-link').forEach(tab => {
    tab.addEventListener('click', function (event) {
        event.preventDefault();
        const tabName = this.getAttribute('data-bs-target').replace('#', '');
        switch (tabName) {
            case 'task':
                loadTasks(null, allItem);
                break;
            case 'agent':
                loadTasks(task => !task.completed, agentItem);
                break;
            case 'finish':
                loadTasks(task => task.completed, finishItem);
                break;
        }
    });
});

// 移動任務項目到對應的頁籤
function moveTaskItem(task) {
    if (task.completed) {
        if (agentItem.contains(task.element)) {
            agentItem.removeChild(task.element); // 從待完成頁籤中移除
        }
        finishItem.appendChild(task.element); // 添加到已完成頁籤中
    } else {
        if (finishItem.contains(task.element)) {
            finishItem.removeChild(task.element); // 從已完成頁籤中移除
        }
        agentItem.appendChild(task.element); // 添加到待完成頁籤中
    }
}

// 初次加載任務列表
loadAllTasks();

// 定義task資料，如果local中有資料就抓取，如果沒有則為空陣列
let taskListArray = JSON.parse(localStorage.getItem('taskListArray')) || [];

// 定義任務列表的 DOM 元素
const mainArea = document.querySelector('#mainArea');
const taskArea = document.querySelector('.mainListItemBorder');
const allItem = document.getElementById('task-list');
const agentItem = document.getElementById('task-list-agent');
const finishItem = document.getElementById('task-list-finish');

// 建立目前尚無代辦事項的 div 元素
const noTask = document.createElement('div');
noTask.className = 'noTask';
noTask.innerHTML = '<p>目前尚無代辦事項</p><img src="images/noTask.svg">';
mainArea.removeChild(taskArea); // 預設隱藏任務狀態
mainArea.appendChild(noTask); // 預設顯示無任務畫面

// 如果任務列表是空的就顯示無代辦，會從其他動作中調用
function updateNoTaskClass() {
    if (taskListArray.length === 0) {
        if (!document.contains(noTask)) {
            mainArea.appendChild(noTask);
            mainArea.removeChild(taskArea);
        }
    } else {
        if (document.contains(noTask)) {
            mainArea.removeChild(noTask);
            mainArea.appendChild(taskArea);
        }
    }
}

// 將 taskListArray 保存到 localStorage，會從其他動作中調用
function saveToLocalStorage() {
    localStorage.setItem('taskListArray', JSON.stringify(taskListArray));
    console.table(taskListArray.map(task => ({
        text: task.text,
        completed: task.completed,
        index: taskListArray.indexOf(task),
        id: task.id
    })));
}

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
function createDelBtn(listItem, taskId) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm mx-2 delBtn';
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener('click', function () {
        const index = taskListArray.findIndex(item => item.id === taskId);
        if (index > -1) {
            taskListArray.splice(index, 1);
            saveToLocalStorage();
            loadAllTasks();
            showAgentTasks(); // 更新待完成數量
        }
    });
    return delBtn;
}

// 建立核取方塊，會從其他動作中調用
function createCheckBox(listItem, statusSpan, taskId) {
    const checkBox = document.createElement('input');
    checkBox.className = 'form-check-input';
    checkBox.setAttribute("type", "checkbox");
    const index = taskListArray.findIndex(item => item.id === taskId);
    if (index > -1) {
        checkBox.checked = taskListArray[index].completed;
    }

    checkBox.addEventListener('change', function () {
        const index = taskListArray.findIndex(item => item.id === taskId);
        if (index > -1) {
            taskListArray[index].completed = checkBox.checked;
            statusSpan.innerText = checkBox.checked ? '已完成' : '待完成';
            statusSpan.className = checkBox.checked ? 'badge bg-success mx-2' : 'badge bg-warning text-dark mx-2';
            saveToLocalStorage();
            loadAllTasks();
            showAgentTasks();
        }
    });
    return checkBox;
}

// 建立修改按鈕，會從其他動作中調用
function createUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn, taskId) {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-sm mx-2 updateBtn';
    updateBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

    updateBtn.addEventListener('click', function () {
        const todoUpdate = document.createElement('input');
        todoUpdate.className = 'form-control';
        todoUpdate.value = listItemText.innerText;

        const updateCheck = document.createElement('button');
        updateCheck.className = 'btn btn-sm mx-2';
        updateCheck.innerHTML = '<i class="fa-solid fa-check"></i>';

        listItem.innerHTML = '';
        listItem.appendChild(todoUpdate);
        listItem.appendChild(updateCheck);

        updateCheck.addEventListener('click', function () {
            const newText = todoUpdate.value;
            if (newText) {
                const index = taskListArray.findIndex(item => item.id === taskId);
                if (index > -1) {
                    taskListArray[index].text = newText;
                    saveToLocalStorage();
                    loadAllTasks();
                    console.log('修改任務:', {
                        text: taskListArray[index].text,
                        id: taskListArray[index].id
                    });
                }
            }
        });
    });
    return updateBtn;
}

// 顯示待完成事項及刪除完成事項按鈕
function showAgentTasks() {
    const agentTasks = taskListArray.filter(task => !task.completed);
    const agentTasksSpan = document.querySelector('#taskCount');
    agentTasksSpan.innerText = agentTasks.length;

    const deleteFinishBtn = document.querySelector('#clearAllBtn');
    deleteFinishBtn.addEventListener('click', function () {
        taskListArray = taskListArray.filter(task => !task.completed);
        saveToLocalStorage();
        loadAllTasks();
    });
    return agentTasksSpan;
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
        const checkBox = createCheckBox(listItem, statusSpan, task.id);
        const delBtn = createDelBtn(listItem, task.id);
        const updateBtn = createUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn, task.id);

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
        const newTask = {
            text: taskText,
            completed: false,
            id: Date.now() // 使用時間戳作為唯一識別
        };
        taskListArray.push(newTask);
        saveToLocalStorage();
        taskInput.value = ''; // 將輸入框清空
        loadAllTasks(); // 重新加載任務列表以綁定事件處理程序
        showAgentTasks(); // 更新待完成數量
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

// 當頁面加載時加載所有任務
loadAllTasks();
showAgentTasks(); // 更新待完成數量
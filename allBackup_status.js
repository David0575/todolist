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
        if (!allItem.contains(noTaskLi)) {
            allItem.appendChild(noTaskLi); // 如果任務列表是空的，添加 noTaskLi
        }
    } else {
        if (allItem.contains(noTaskLi)) {
            allItem.removeChild(noTaskLi); // 如果任務列表不是空的，移除 noTaskLi
        }
    }
}; 

// 將 taskListArray 保存到 localStorage，會從其他動作中調用
function saveToLocalStorage() {
    localStorage.setItem('taskListArray', JSON.stringify(taskListArray));
};

// 設定任務清單的li顯示，會從其他動作中調用
function selectListItem() {
    const listItem = document.createElement('li'); // 新增li
    const listItemText = document.createElement('p'); // 新增P內容
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center'; // 設定li的class
    listItemText.className = 'flex-grow-1 mx-2';
    return { listItem, listItemText };
};

// 建立狀態標籤，會從其他動作中調用
function selectStatusSpan(status) {
    const statusSpan = document.createElement('span');
    statusSpan.className = status ? 'badge bg-success mx-2' : 'badge bg-warning text-dark mx-2';
    statusSpan.innerText = status ? '已完成' : '待完成';
    return statusSpan;
}

// 建立刪除按鈕，會從其他動作中調用
function selectDelBtn(listItem) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-sm mx-2';
    delBtn.innerText = '刪除';
    delBtn.addEventListener('click', function () {
        const index = taskListArray.findIndex(item => item.element === listItem);
        if (index > -1) {
            taskListArray.splice(index, 1); // 從陣列中刪除該項目
        }
        allItem.removeChild(listItem); // 從 DOM 中移除該項目
        updateNoTaskClass();
        saveToLocalStorage(); // 更新 localStorage
    });
    return delBtn;
};

// 建立核取方塊，會從其他動作中調用
function selectCheckBox(listItem, statusSpan) {
    const checkBox = document.createElement('input');
    checkBox.className = 'form-check-input';
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener('change', function () {
        const index = taskListArray.findIndex(item => item.element === listItem);
        if (index > -1) {
            taskListArray[index].completed = checkBox.checked;
            statusSpan.innerText = checkBox.checked ? '已完成' : '待完成';
            statusSpan.className = checkBox.checked ? 'badge bg-success mx-2' : 'badge bg-warning text-dark mx-2';
            saveToLocalStorage(); // 更新 localStorage
        }
    });
    return checkBox;
}

// 建立修改按鈕，會從其他動作中調用
function selectUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn) {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-info btn-sm mx-2';
    updateBtn.innerText = '修改';
    updateBtn.addEventListener('click', function () {
        const todoUpdate = document.createElement('input'); // 新增一個輸入框供修改，抓取原本的值
        todoUpdate.className = 'form-control';
        todoUpdate.value = listItemText.innerText; 

        const updateCheck = document.createElement('button');
        updateCheck.className = 'btn btn-info btn-sm mx-2';
        updateCheck.innerText = '確定修改';
        listItem.innerHTML = ''; // 清空 listItem 內容
        listItem.appendChild(todoUpdate);
        listItem.appendChild(updateCheck);

        updateCheck.addEventListener('click', function () {
            const newText = todoUpdate.value;
            if (newText) {
                listItem.innerHTML = ''; // 清空 listItem 內容
                listItemText.innerText = newText;
                listItem.appendChild(checkBox);
                listItem.appendChild(statusSpan);
                listItem.appendChild(listItemText);
                listItem.appendChild(updateBtn);
                listItem.appendChild(delBtn);

                const index = taskListArray.findIndex(item => item.element === listItem);
                if (index > -1) {
                    taskListArray[index].text = newText; // 更新 taskListArray 中的文字
                    taskListArray[index].textElement.innerText = newText;
                }
                saveToLocalStorage(); // 更新 localStorage
            }
        });
    });
    return updateBtn;
};

// 將任務項目添加到DOM，會從其他動作中調用
function addTaskToDOM(listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn) {
    listItem.appendChild(checkBox);
    listItem.appendChild(statusSpan);
    listItem.appendChild(listItemText);
    listItem.appendChild(updateBtn);
    listItem.appendChild(delBtn);
    //allItem.appendChild(listItem);
};

// 加載local資料顯示在列表，在本段最結尾調用
function loadTasks() {
    taskListArray.forEach(task => { //用forEach抓取local的所有陣列內容
        const { listItem, listItemText } = selectListItem(); //設定任務清單的li
        listItemText.innerText = task.text; // 寫入li的內容，從local的陣列物件中抓取text資料寫入

        const statusSpan = selectStatusSpan(task.completed); // 設定狀態標籤
        const checkBox = selectCheckBox(listItem, statusSpan); // 設定勾選鈕
        checkBox.checked = task.completed; // 設定核取方塊的狀態
        const delBtn = selectDelBtn(listItem); // 設定刪除鈕
        const updateBtn = selectUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn); // 設定更新鈕

        addTaskToDOM(listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去
        allItem.appendChild(listItem);

        task.element = listItem; // 將 DOM 元素綁定到任務對象
        task.textElement = listItemText;
    });
    updateNoTaskClass(); // 判斷是否已無任務清單
};

// 加載local資料顯示在已完成清單內
function loadAgentTasks() {
    const agentTasksArray = taskListArray.filter(task => task.completed === false );
    agentTasksArray.forEach(task => {
        const { listItem, listItemText } = selectListItem(); //設定任務清單的li
        listItemText.innerText = task.text; // 寫入li的內容，從local的陣列物件中抓取text資料寫入

        const statusSpan = selectStatusSpan(task.completed); // 設定狀態標籤
        const checkBox = selectCheckBox(listItem, statusSpan); // 設定勾選鈕
        checkBox.checked = task.completed; // 設定核取方塊的狀態
        const delBtn = selectDelBtn(listItem); // 設定刪除鈕
        const updateBtn = selectUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn); // 設定更新鈕

        addTaskToDOM(listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去
        agentItem.appendChild(listItem);

        task.element = listItem; // 將 DOM 元素綁定到任務對象
        task.textElement = listItemText;
    });
    
    const finishTasksArray = taskListArray.filter(task => task.completed === true );
    finishTasksArray.forEach(task => {
        const { listItem, listItemText } = selectListItem(); //設定任務清單的li
        listItemText.innerText = task.text; // 寫入li的內容，從local的陣列物件中抓取text資料寫入

        const statusSpan = selectStatusSpan(task.completed); // 設定狀態標籤
        const checkBox = selectCheckBox(listItem, statusSpan); // 設定勾選鈕
        checkBox.checked = task.completed; // 設定核取方塊的狀態
        const delBtn = selectDelBtn(listItem); // 設定刪除鈕
        const updateBtn = selectUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn); // 設定更新鈕

        addTaskToDOM(listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去
        finishItem.appendChild(listItem);

        task.element = listItem; // 將 DOM 元素綁定到任務對象
        task.textElement = listItemText;
    });
    updateNoTaskClass();
}

// 每切換一次頁籤就觸發loadAgentTasks
//document.getElementsByClassName('nav-item').addEventListener('click', function () {
    //loadAgentTasks();
//});

// 當點擊新增按鈕時，創建一個新的任務
document.getElementById('todoCreateBtn').addEventListener('click', function () {
    const taskInput = document.getElementById('todoCreate');
    const taskText = taskInput.value;
    if (taskText) { // 如果輸入框有寫東西
        const { listItem, listItemText } = selectListItem(); // 設定任務清單的li
        listItemText.innerText = taskText; // 從輸入框的value寫入內容

        const statusSpan = selectStatusSpan(false); // 預設為待完成
        const checkBox = selectCheckBox(listItem, statusSpan); // 設定勾選鈕
        const delBtn = selectDelBtn(listItem); // 設定刪除鈕
        const updateBtn = selectUpdateBtn(listItem, checkBox, statusSpan, listItemText, delBtn); // 設定更新鈕

        // 將新的任務添加到陣列中
        taskListArray.push({ element: listItem, textElement: listItemText, text: taskText, completed: false });

        addTaskToDOM(listItem, checkBox, statusSpan, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去
        allItem.appendChild(listItem);

        taskInput.value = ''; // 清空輸入框
        updateNoTaskClass(); // 判斷是否已無任務清單
        saveToLocalStorage(); // 更新local
    }
});

// 加載local清單
loadTasks();
loadAgentTasks();

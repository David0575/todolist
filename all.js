// 定義task資料，如果local中有資料就抓取，如果沒有則為空字串
let taskListArray = JSON.parse(localStorage.getItem('taskListArray')) || [];

// 定義任務列表的 DOM 元素
const allItem = document.getElementById('task-list');

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
    const listItem = document.createElement('li');
    const listItemText = document.createElement('p');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    return { listItem, listItemText };
};

// 建立刪除按鈕，會從其他動作中調用
function selectDelBtn(listItem) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-sm';
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

// 建立修改按鈕，會從其他動作中調用
function selectUpdateBtn(listItem, listItemText, delBtn) {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-info btn-sm';
    updateBtn.innerText = '修改';
    updateBtn.addEventListener('click', function () {
        const todoUpdate = document.createElement('input');
        todoUpdate.className = 'form-control';
        todoUpdate.value = listItemText.innerText;

        const updateCheck = document.createElement('button');
        updateCheck.className = 'btn btn-info btn-sm';
        updateCheck.innerText = '確定修改';
        listItem.innerHTML = ''; // 清空 listItem 內容
        listItem.appendChild(todoUpdate);
        listItem.appendChild(updateCheck);

        updateCheck.addEventListener('click', function () {
            const newText = todoUpdate.value;
            if (newText) {
                listItem.innerHTML = ''; // 清空 listItem 內容
                listItemText.innerText = newText;
                listItem.appendChild(listItemText);
                listItem.appendChild(delBtn);
                listItem.appendChild(updateBtn);

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
function addTaskToDOM(listItem, listItemText, delBtn, updateBtn) {
    listItem.appendChild(listItemText);
    listItem.appendChild(delBtn);
    listItem.appendChild(updateBtn);
    allItem.appendChild(listItem);
};

// 加載local資料顯示在列表
function loadTasks() {
    taskListArray.forEach(task => { //用forEach抓取local的所有陣列內容
        const { listItem, listItemText } = selectListItem(); //設定任務清單的li
        listItemText.innerText = task.text; // 寫入li的內容，從local的陣列物件中抓取text資料寫入

        const delBtn = selectDelBtn(listItem); // 設定刪除鈕
        const updateBtn = selectUpdateBtn(listItem, listItemText, delBtn); // 設定更新鈕

        addTaskToDOM(listItem, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去

        task.element = listItem; // 將 DOM 元素綁定到任務對象
        task.textElement = listItemText;
    });
    updateNoTaskClass(); // 判斷是否已無任務清單
};

// 當點擊新增按鈕時，創建一個新的任務
document.getElementById('todoCreateBtn').addEventListener('click', function () {
    const taskInput = document.getElementById('todoCreate');
    const taskText = taskInput.value;
    if (taskText) { // 如果輸入框有寫東西
        const { listItem, listItemText } = selectListItem(); // 設定任務清單的li
        listItemText.innerText = taskText; // 從輸入框的value寫入內容

        // 將新的任務添加到陣列中
        taskListArray.push({ element: listItem, textElement: listItemText, text: taskText });

        const delBtn = selectDelBtn(listItem); // 設定刪除鈕
        const updateBtn = selectUpdateBtn(listItem, listItemText, delBtn); // 設定更新鈕

        addTaskToDOM(listItem, listItemText, delBtn, updateBtn); // 將該更新到頁面的item、文字、按鈕都更新上去

        taskInput.value = ''; // 清空輸入框
        updateNoTaskClass(); // 判斷是否已無任務清單
        saveToLocalStorage(); // 更新local
    }
});

// 加載local清單
loadTasks();

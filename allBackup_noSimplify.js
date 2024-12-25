// 從 localStorage 中加載已存的 taskListArray，若不存在則初始化為空陣列
let taskListArray = JSON.parse(localStorage.getItem('taskListArray')) || [];

// 獲取任務列表的 DOM 元素
const allItem = document.getElementById('task-list');

// 創建一個 "目前尚無代辦事項" 的 li 元素
const noTaskLi = document.createElement('li');
noTaskLi.className = 'list-group-item d-flex justify-content-between align-items-center';
noTaskLi.innerText = '目前尚無代辦事項';
allItem.appendChild(noTaskLi); // 預設將 "目前尚無代辦事項" 的 li 元素添加到任務列表中

// 根據 taskListArray 的長度來更新 noTaskLi 的顯示狀態
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
}

// 將 taskListArray 保存到 localStorage
function saveToLocalStorage() {
    localStorage.setItem('taskListArray', JSON.stringify(taskListArray));
}

// 加載本地存儲的任務並將其顯示在任務列表中
function loadTasks() {
    taskListArray.forEach(task => {
        const listItem = document.createElement('li');
        const listItemText = document.createElement('p');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItemText.innerText = task.text;

        // 創建刪除按鈕
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-danger btn-sm';
        delBtn.innerText = '刪除';
        delBtn.addEventListener('click', function() {
            const index = taskListArray.findIndex(item => item.element === listItem);
            if (index > -1) {
                taskListArray.splice(index, 1); // 從陣列中刪除該項目
            }
            allItem.removeChild(listItem); // 從 DOM 中移除該項目
            updateNoTaskClass();
            saveToLocalStorage(); // 更新 localStorage
            console.log(taskListArray.map(item => item.text));
        });

        // 創建修改按鈕
        const updateBtn = document.createElement('button');
        updateBtn.className = 'btn btn-info btn-sm';
        updateBtn.innerText = '修改';
        updateBtn.addEventListener('click', function() {
            const todoUpdate = document.createElement('input');
            todoUpdate.className = 'form-control';
            todoUpdate.value = listItemText.innerText;

            const updateCheck = document.createElement('button');
            updateCheck.className = 'btn btn-info btn-sm';
            updateCheck.innerText = '確定修改';
            listItem.innerHTML = ''; // 清空 listItem 內容
            listItem.appendChild(todoUpdate);
            listItem.appendChild(updateCheck);

            updateCheck.addEventListener('click', function() {
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
            console.log(taskListArray.map(item => item.text));
        });

        // 將文本和按鈕添加到 listItem 並添加到任務列表中
        listItem.appendChild(listItemText);
        listItem.appendChild(delBtn);
        listItem.appendChild(updateBtn);
        allItem.appendChild(listItem);

        task.element = listItem; // 將 DOM 元素綁定到任務對象
        task.textElement = listItemText;
    });
    updateNoTaskClass();
}

// 當點擊新增按鈕時，創建一個新的任務
document.getElementById('todoCreateBtn').addEventListener('click', function() {
    const taskInput = document.getElementById('todoCreate');
    const taskText = taskInput.value;
    if (taskText) {
        const listItem = document.createElement('li');
        const listItemText = document.createElement('p');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItemText.innerText = taskText;

        // 將新的任務添加到陣列中
        taskListArray.push({ element: listItem, textElement: listItemText, text: taskText });

        // 創建刪除按鈕
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-danger btn-sm';
        delBtn.innerText = '刪除';
        delBtn.addEventListener('click', function() {
            const index = taskListArray.findIndex(item => item.element === listItem);
            if (index > -1) {
                taskListArray.splice(index, 1); // 從陣列中刪除該項目
            }
            allItem.removeChild(listItem); // 從 DOM 中移除該項目
            updateNoTaskClass();
            saveToLocalStorage(); // 更新 localStorage
            console.log(taskListArray.map(item => item.text));
        });

        // 創建修改按鈕
        const updateBtn = document.createElement('button');
        updateBtn.className = 'btn btn-info btn-sm';
        updateBtn.innerText = '修改';
        updateBtn.addEventListener('click', function() {
            const todoUpdate = document.createElement('input');
            todoUpdate.className = 'form-control';
            todoUpdate.value = listItemText.innerText;

            const updateCheck = document.createElement('button');
            updateCheck.className = 'btn btn-info btn-sm';
            updateCheck.innerText = '確定修改';
            listItem.innerHTML = ''; // 清空 listItem 內容
            listItem.appendChild(todoUpdate);
            listItem.appendChild(updateCheck);

            updateCheck.addEventListener('click', function() {
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
            console.log(taskListArray.map(item => item.text));
        });

        // 將文本和按鈕添加到 listItem 並添加到任務列表中
        listItem.appendChild(listItemText);
        listItem.appendChild(delBtn);
        listItem.appendChild(updateBtn);
        allItem.appendChild(listItem);

        taskInput.value = ''; // 清空輸入框
        updateNoTaskClass();
        saveToLocalStorage(); // 更新 localStorage
    }
    console.log(taskListArray.map(item => item.text));
});

// 加載本地存儲的任務
loadTasks();

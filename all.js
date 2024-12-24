let taskListArray = [];

const allItem = document.getElementById('task-list');
const noTaskLi = document.createElement('li');
noTaskLi.className = 'list-group-item d-flex justify-content-between align-items-center';
noTaskLi.innerText = '目前尚無代辦事項';
allItem.appendChild(noTaskLi);
function updateNoTaskClass() {
    if (taskListArray.length === 0) {
        // 如果陣列為空，顯示 noTaskLi
        allItem.appendChild(noTaskLi);
    } else {
        // 如果陣列不為空，移除 noTaskLi
        allItem.removeChild(noTaskLi);
    }
}


document.getElementById('todoCreateBtn').addEventListener('click', function() {
    const taskInput = document.getElementById('todoCreate');
    const taskText = taskInput.value;
    if (taskText) {
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        const listItemText = document.createElement('p');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItemText.innerText = taskText;

        // 將 listItem 和 listItemText 包裝進該陣列的物件中
        taskListArray.push({ element: listItem, textElement: listItemText, text: taskText });

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-danger btn-sm';
        delBtn.innerText = '刪除';
        delBtn.addEventListener('click', function() {
            const index = taskListArray.findIndex(item => item.element === listItem);
            if (index > -1) {
                taskListArray.splice(index, 1); // 從陣列中刪除該項目
            }
            taskList.removeChild(listItem);
            updateNoTaskClass();
            console.log(taskListArray.map(item => item.text));
        });
        
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
            listItem.innerText = '';
            listItem.appendChild(todoUpdate);
            listItem.appendChild(updateCheck);

            updateCheck.addEventListener('click', function() {
                const newText = todoUpdate.value;
                if (newText) {
                    listItem.innerHTML = '';
                    listItemText.innerText = newText;
                    listItem.appendChild(listItemText);
                    listItem.appendChild(delBtn);
                    listItem.appendChild(updateBtn);

                    const index = taskListArray.findIndex(item => item.element === listItem);
                    if (index > -1) {
                        taskListArray[index].text = newText;
                        taskListArray[index].textElement.innerText = newText;
                    }
                }
            });
            console.log(taskListArray.map(item => item.text));
        });

        listItem.appendChild(listItemText);
        listItem.appendChild(delBtn);
        listItem.appendChild(updateBtn);
        taskList.appendChild(listItem);

        taskInput.value = '';
        updateNoTaskClass();
    }
    console.log(taskListArray.map(item => item.text));
});
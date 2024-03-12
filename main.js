document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const addTaskForm = document.getElementById("addTaskForm");
    const taskInput = document.getElementById("taskInput");
    const importanceSelect = document.getElementById("importanceSelect");

    // Loads activities saved to localStorage on page load
    loadTasks();

    // Manage form submission to add a new task
    addTaskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const importance = importanceSelect.value;
            const confirmAdd = confirm(`Vuoi davvero aggiungere questa attività con importanza ${importance}?`);
            if (confirmAdd) {
                addTask(taskText, importance);
                taskInput.value = "";
            }
        }
    });

    // Function to add a task to the list
    function addTask(taskText, importance) {
        const li = document.createElement("li");
        li.classList.add("d-flex", "align-items-center", "m-3");
        
        // Add a check icon to mark the task as completed
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "me-3");
        li.appendChild(checkbox);

        const taskContent = document.createElement("div");
        taskContent.classList.add("whiteBg", "d-flex", "align-items-center", "flex-grow-1");
        taskContent.innerHTML = `
            <p class="m-0 ps-3 fw-bold">${taskText}</p>
            <button class="btn btn-danger btn-sm ms-auto m-1" onclick="deleteTask(this)">Delete</button>
        `;
        switch (importance) {
            case "low":
                taskContent.querySelector("p").classList.add("low-importance");
                break;
            case "medium":
                taskContent.querySelector("p").classList.add("medium-importance");
                break;
            case "high":
                taskContent.querySelector("p").classList.add("high-importance");
                break;
        }
        li.appendChild(taskContent);
        taskList.appendChild(li);
        saveTasks();
    }

    // Function to load tasks saved in localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTask(task.text, task.importance));
    }

    // Function to save activities in localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => {
            const text = li.querySelector("div p").textContent;
            const importance = getImportance(li.querySelector("div p"));
            return { text, importance };
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Reset the list and localStorage
    function resetTasks() {
        const confirmReset = confirm("Vuoi davvero eliminare tutte le attività?");
        if (confirmReset) {
            taskList.innerHTML = "";
            localStorage.removeItem("tasks");
        }
    }

    // Add click event for resetting activities
    document.getElementById("navbarNav").insertAdjacentHTML("beforebegin", `
        <div class="d-flex">
            <button id="resetTasksButton" class="btn btn-danger my-2">Cancella attività</button>
        </div>
    `);
    document.getElementById("resetTasksButton").addEventListener("click", resetTasks);

    // Function to get the importance of an activity
    function getImportance(element) {
        if (element.classList.contains("low-importance")) return "low";
        if (element.classList.contains("medium-importance")) return "medium";
        if (element.classList.contains("high-importance")) return "high";
        return "";
    }

    // Function to delete a task from the list
    window.deleteTask = function (button) {
        const li = button.closest("li");
        const taskText = li.querySelector("div p").textContent;
        const confirmDelete = confirm(`Vuoi davvero eliminare l'attività "${taskText}"?`);
        if (confirmDelete) {
            li.remove();
            saveTasks();
        }
    };
});
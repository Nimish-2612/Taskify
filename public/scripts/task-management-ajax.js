const completeTaskFormElement = document.querySelectorAll(".taskCompletedForm");
const taskCompleteButtonElement = document.querySelectorAll(".task-completed-btn");
async function changeTaskStatus(event) {
  // event.preventDefault();
  const todoId = event.target.dataset.taskId;
  
  const taskStatusTextElement =event.target.parentElement.parentElement.firstElementChild;
  
  const response = await fetch(`/add-task/${todoId}/done`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

}


for (const form of completeTaskFormElement) {
  form.addEventListener("submit", changeTaskStatus);
}




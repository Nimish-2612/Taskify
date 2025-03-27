function updateProgressBar() {
    const tasks = document.querySelectorAll(".task");
    const completedTasks = [...tasks].filter(task => task.dataset.completed);
    
    
    const completionRate = (completedTasks.length / tasks.length) * 100;
  
    // Update the width of the progress bar
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${completionRate}%`;
  }
  
  // Run the function to initialize the progress bar
  updateProgressBar();
  
const palette = ["#ff6b6b", "#ffd166", "#06d6a0", "#4dabf7", "#c77dff", "#f08a5d", "#90be6d", "#f8961e"];

const tasks = ["Write tests", "Refactor code", "Read docs"];
let spinning = false;
let wheelRotation = 0;

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const spinBtn = document.getElementById("spin-btn");
const result = document.getElementById("result");
const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

function updateTaskList() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task;
    taskList.append(li);
  });
  spinBtn.disabled = tasks.length < 2 || spinning;
}

function drawWheel() {
  const radius = wheel.width / 2;
  ctx.clearRect(0, 0, wheel.width, wheel.height);

  if (tasks.length === 0) {
    ctx.fillStyle = "#2b2f3a";
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 4, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const sliceAngle = (Math.PI * 2) / tasks.length;
  tasks.forEach((task, index) => {
    const start = index * sliceAngle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 4, start, end);
    ctx.closePath();
    ctx.fillStyle = palette[index % palette.length];
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#102033";
    ctx.font = "bold 16px Inter, Arial, sans-serif";
    ctx.fillText(task.slice(0, 16), radius - 16, 6);
    ctx.restore();
  });
}

function spinWheel() {
  if (spinning || tasks.length < 2) return;
  spinning = true;
  spinBtn.disabled = true;
  result.textContent = "Spinning...";

  const selected = Math.floor(Math.random() * tasks.length);
  const slice = 360 / tasks.length;
  const centerOfSlice = selected * slice + slice / 2;
  const target = 360 - centerOfSlice;
  const extraTurns = 360 * (5 + Math.floor(Math.random() * 3));
  wheelRotation += extraTurns + target;

  wheel.style.transform = `rotate(${wheelRotation}deg)`;

  setTimeout(() => {
    result.textContent = `Selected task: ${tasks[selected]}`;
    spinning = false;
    spinBtn.disabled = tasks.length < 2;
  }, 4000);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = taskInput.value.trim();
  if (!task) return;
  tasks.push(task);
  taskInput.value = "";
  drawWheel();
  updateTaskList();
  result.textContent = "Spin when ready.";
});

spinBtn.addEventListener("click", spinWheel);

drawWheel();
updateTaskList();

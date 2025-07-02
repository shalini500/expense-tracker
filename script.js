const moodButtons = document.querySelectorAll('.mood-btn');
const todayMoodEl = document.getElementById('todayMood');
const habitListEl = document.getElementById('habitList');
const newHabitInput = document.getElementById('newHabitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const completedCountEl = document.getElementById('completedCount');

let todayDate = new Date().toLocaleDateString();
let data = JSON.parse(localStorage.getItem('trackerData')) || {};

// Ensure today's data exists
if (!data[todayDate]) {
  data[todayDate] = { mood: '', habits: [] };
}

// Mood select
moodButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Set mood
    data[todayDate].mood = btn.dataset.mood;
    saveData();
    updateMoodUI();
  });
});

// Add new habit
addHabitBtn.addEventListener('click', () => {
  const habitName = newHabitInput.value.trim();
  if (habitName) {
    data[todayDate].habits.push({ name: habitName, completed: false });
    newHabitInput.value = '';
    saveData();
    updateHabitList();
  }
});

// Toggle habit complete
function toggleHabit(index) {
  data[todayDate].habits[index].completed = !data[todayDate].habits[index].completed;
  saveData();
  updateHabitList();
}

// Update mood UI
function updateMoodUI() {
  todayMoodEl.textContent = data[todayDate].mood || '-';
  moodButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mood === data[todayDate].mood);
  });
}

// Update habit list UI
function updateHabitList() {
  habitListEl.innerHTML = '';
  data[todayDate].habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${habit.completed ? 'checked' : ''} onclick="toggleHabit(${index})">
      <span>${habit.name}</span>
    `;
    habitListEl.appendChild(li);
  });

  const completed = data[todayDate].habits.filter(h => h.completed).length;
  completedCountEl.textContent = completed;
}

// Save to LocalStorage
function saveData() {
  localStorage.setItem('trackerData', JSON.stringify(data));
}

// Init
updateMoodUI();
updateHabitList();

// Make toggleHabit global so onclick works
window.toggleHabit = toggleHabit;
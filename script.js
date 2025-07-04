const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalSpan = document.getElementById('total');
const chartCanvas = document.getElementById('summary-chart');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

let chart; // Chart instance

function renderExpenses() {
  expenseList.innerHTML = '';
  let total = 0;
  expenses.forEach(exp => {
    const li = document.createElement('li');
    li.textContent = `${exp.date} - ₹${exp.amount} [${exp.category}] : ${exp.note}`;
    expenseList.appendChild(li);
    total += Number(exp.amount);
  });
  totalSpan.textContent = total;
  updateChart();
}

function updateChart() {
  const categoryTotals = {};
  expenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += Number(exp.amount);
  });
  
  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);
  
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: ['#ff6384','#36a2eb','#cc65fe','#ffce56','#4bc0c0','#f77825'],
      }]
    }
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const note = document.getElementById('note').value;
  const date = document.getElementById('date').value;
  
  const newExpense = { amount, category, note, date };
  expenses.push(newExpense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  
  form.reset();
  renderExpenses();
});

renderExpenses();
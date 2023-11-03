const main = () => {
  const statistics= document.getElementById('statistics');
  const doughnut= document.getElementById('doughnut');
  const polar= document.getElementById('polar');
  const data = {
    labels: ['Salary', 'Dividend', 'Loan', 'Investment', 'Money Refund'],
    datasets: [{
      label: '',
      data: [100000, 20000, 30000, 40000, 50000],
      borderWidth: 1
    }]
  };

  const dataStatistics = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Income',
      data: [100000, 40000, 30000, 40000, 50000, 30000, 70000, 80000, 50000, 100000, 110000, 90000],
      borderWidth: 1
    },
    {
      label: 'Expense',
      data: [20000, 30000, 40000, 20000, 60000, 70000, 40000, 90000, 70000, 80000, 50000, 60000],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: window.matchMedia('(max-device-width: 1024px)').matches ? 'right' : 'top',
      },
    }
  }

  new Chart(statistics, {
    type: 'line',
    data: dataStatistics,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Annual Report'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  });

  new Chart(doughnut, {
    type: 'doughnut',
    data: data,
    options, 
  });

  new Chart(polar, {
    type: 'polarArea',
    data: data,
    options
  })
}

main();
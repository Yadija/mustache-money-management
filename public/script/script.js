const MONTHS = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const main = () => {
  const doughnut= document.getElementById('doughnut');
  const polar= document.getElementById('polar');

  // set selected in option
  const year = new Date().getFullYear();
  const option = document.querySelector(`option[value='${year}']`);
  option.setAttribute('selected', 'selected');

  // statistics chart
  let statisticsChart;
  const statistics = (year) => {
    const statisticsCanvas = document.getElementById('statisticsCanvas');
    const statisticsData = document.getElementById('statisticsData');
    const annuals = JSON.parse(statisticsData.dataset.annuals);
    const getAnnualsByYear = annuals.filter(annual => annual.year === year);

    const data = {
      labels: Object.values(MONTHS),
      datasets: [{
        label: 'Income',
        data: getAnnualsByYear[0].incomes.map(item => item.value),
        borderWidth: 1
      },
      {
        label: 'Expense',
        data: getAnnualsByYear[0].expenses.map(item => item.value),
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    if (statisticsChart) statisticsChart.destroy();
    statisticsChart = new Chart(statisticsCanvas, { type: 'line', data, options });
  }
  statistics(year);

  const statisticsFilter = document.getElementById('statisticsFilter');
  statisticsFilter.addEventListener('change', (event) => {
    statistics(Number(event.target.value));
  })


  const data = {
    labels: ['Salary', 'Dividend', 'Loan', 'Investment', 'Money Refund'],
    datasets: [{
      label: '',
      data: [100000, 20000, 30000, 40000, 50000],
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
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

  let doughtnutChart, polarChart;
  const chartBar = (type) => {
    const dataChart = {
      incomes: {
        Salary: 10000,
        Bonus: 5000,
        Dividend: 8000,
      },
      expenses: {
        Tax: 1000,
        Transport: 3000,
        Rent: 20000,
        Food: 4000,
      }
    };

    const data = {
      labels: Object.keys(dataChart[type]),
      datasets: [{
        label: '',
        data: Object.values(dataChart[type]),
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

    if (doughtnutChart && polarChart) {
      doughtnutChart.destroy();
      polarChart.destroy();
    }

    doughtnutChart = new Chart(doughnut, {
      type: 'doughnut',
      data: data,
      options, 
    });

    polarChart = new Chart(polar, {
      type: 'polarArea',
      data: data,
      options
    })
  }
  chartBar('incomes');

  const buttons = document.querySelectorAll('.chart-bar__button-item');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      if (event.target.classList.contains('button__active')) return;

      buttons.forEach(button => button.classList.remove('button__active'));
      event.target.classList.add('button__active');
      chartBar(event.target.textContent.toLowerCase());
    })
  })
}

main();
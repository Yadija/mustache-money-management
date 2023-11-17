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
  if (option) option.setAttribute('selected', 'selected');

  // statistics chart
  let statisticsChart;
  const statistics = (year) => {
    const statisticsCanvas = document.getElementById('statisticsCanvas');
    const statisticsData = document.getElementById('statisticsData');
    const annuals = JSON.parse(statisticsData.dataset.annuals);
    const getAnnualsByYear = annuals.filter(annual => annual.year === year);

    if (annuals.length === 0) return;
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
    const chartBar = document.getElementById('chartBar');
    const dataChart = {
      incomes: JSON.parse(chartBar.dataset.incomes),
      expenses: JSON.parse(chartBar.dataset.expenses),
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

  // add transaction
  const category = {
    income: ['Salary', 'Dividend', 'Loan', 'Investment', 'Money Refund', 'Other'],
    expense: ['Food', 'Transport', 'Housing', 'Health', 'Education', 'Entertainment', 'Other'],
  };
  
  const setCategory = (type) => {
    const categoryList = document.getElementById('category');
    categoryList.innerHTML = '';
    category[type].forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.innerText = category;
      categoryList.appendChild(option);
    });
  }

  const type = document.getElementById('type');
  type.onchange = () => {
    setCategory(type.value);
  }

  const buttonAdd = document.getElementById('buttonAdd');
  buttonAdd.onclick = () => {
    document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setCategory('income');

    const modal = document.getElementById('modalContainer');
    modal.style.display = 'block';
  }

  const modal = document.getElementById('modalContainer');
  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }

  const closeButton = document.getElementById('closeButton');
  closeButton.onclick = () => {
    const modal = document.getElementById('modalContainer');
    modal.style.display = 'none';
  }

  // close message
  const closeMessage = document.getElementById('closeMessage');
  if (closeMessage) {
    closeMessage.onclick = () => {
      const message = document.getElementById('flashMessage');
      message.style.display = 'none';
    };
  }

  // history
  const interactionHistory = document.querySelectorAll('.interaction__history-body-item');
  if (interactionHistory.length > 0) {
    interactionHistory.forEach(item => {
      item.onclick = () => {
        detailModal({
          id: item.dataset.id,
          date: item.dataset.date,
          type: item.dataset.type,
          category: item.dataset.category,
          amount: item.dataset.amount,
          description: item.dataset.description || '-',
        });
      }
    })
  }

  const detailModal = ({ id, date, type, category, amount, description}) => {
    // modal header
    const h2 = document.createElement('h2');
    h2.innerText = 'Detail History';
    h2.className = 'modal__title';

    const closeButton = document.createElement('button');
    closeButton.className = 'modal__close';
    closeButton.innerHTML = '&times;';
    closeButton.id = 'detailCloseButton';
    closeButton.onclick = () => {
      const modal = document.getElementById('detailModalContainer');
      modal.remove();
    }

    const modalHeader = document.createElement('section');
    modalHeader.className = 'modal__header';
    modalHeader.append(h2, closeButton);

    // modal body
    const paraDate = document.createElement('p');
    paraDate.className = 'modal__body-date';
    paraDate.innerText = date;

    const paraType = document.createElement('p');
    paraType.className = 'modal__body-type';
    paraType.innerHTML = `<strong>Type:</strong> ${type}`;

    const paraCategory = document.createElement('p');
    paraCategory.className = 'modal__body-category';
    paraCategory.innerHTML = `<strong>Category:</strong> ${category}`;

    const paraAmount = document.createElement('p');
    paraAmount.className = 'modal__body-amount';
    paraAmount.innerHTML = `<strong>Amount:</strong> ${amount}`;

    const paraDescription = document.createElement('p');
    paraDescription.className = 'modal__body-description';
    paraDescription.innerHTML = `<strong>Description:</strong> ${description}`;

    const modalBody = document.createElement('section');
    modalBody.className = 'modal__body';
    modalBody.append(paraDate, paraType, paraCategory, paraAmount, paraDescription);

    // modal footer
    const deleteButton = document.createElement('button');
    deleteButton.className = 'modal__footer-button-delete';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => {
      alertModal(id);
    }

    const modalFooter = document.createElement('section');
    modalFooter.className = 'modal__footer';
    modalFooter.append(deleteButton);

    // modal
    const modal = document.createElement('section');
    modal.className = 'modal';
    modal.append(modalHeader, modalBody, modalFooter);

    const modalContainer = document.createElement('section');
    modalContainer.id = 'detailModalContainer';
    modalContainer.className = 'detail-modal-container';
    modalContainer.onclick = (event) => {
      if (event.target === modalContainer) {
        modalContainer.remove();
      }
    }
    modalContainer.append(modal);

    // add to body
    const body = document.querySelector('body');
    body.append(modalContainer);
  }

  const alertModal = (id) => {
    // modal header
    const h2 = document.createElement('h2');
    h2.innerText = 'Do you want to delete this transaction?';
    h2.className = 'modal__title';

    const modalHeader = document.createElement('section');
    modalHeader.className = 'modal__header';
    modalHeader.append(h2);


    // modal button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'modal__button-delete';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => {
      window.location.href = `http://${window.location.host}/delete/${id}`;
    }

    const cancelButton = document.createElement('button');
    cancelButton.className = 'modal__button-cancel';
    cancelButton.innerText = 'Cancel';
    cancelButton.onclick = () => {
      const modalContainer = document.getElementById('alertModalContainer');
      modalContainer.remove();
    }

    const modalButton = document.createElement('section');
    modalButton.className = 'modal__button';
    modalButton.append(deleteButton, cancelButton);

    // modal
    const modal = document.createElement('section');
    modal.className = 'modal';
    modal.style.width = '400px';
    modal.append(modalHeader, modalButton);

    const modalContainer = document.createElement('section');
    modalContainer.id = 'alertModalContainer';
    modalContainer.className = 'modal-container';
    modalContainer.style.display = 'block';
    modalContainer.append(modal);

    // add to body
    const body = document.querySelector('body');
    body.append(modalContainer);
  }
}

main();
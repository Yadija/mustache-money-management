import { addTransaction, loadData } from '../utils/data';

const getHistory = () => {
  const data = loadData();

  return data.transactions
    .map((transaction: any) => {
      // format category
      transaction.category = transaction.category[0].toUpperCase() + transaction.category.slice(1);

      // format date
      transaction.date = new Date(transaction.date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // set amount by type
      if (transaction.type === 'expense') {
        return {
          ...transaction,
          amount: -transaction.amount,
        };
      }

      return transaction;
    })
    .reverse();
};

const getYears = () => {
  const data = loadData();

  return data.transactions
    .map((transaction: any) => {
      return new Date(transaction.id).getFullYear();
    })
    .filter((value: number, index: number, self: number[]) => self.indexOf(value) === index)
    .sort((a: number, b: number) => b - a);
};

const getAnnuals = () => {
  const data = loadData();
  const years = getYears();

  const annuals = years.map((year: number) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const incomeMonths = months.map((month: number) => {
      return {
        month,
        value: 0,
      };
    });
    const expenseMonths = months.map((month: number) => {
      return {
        month,
        value: 0,
      };
    });

    return {
      year,
      incomes: incomeMonths,
      expenses: expenseMonths,
    };
  });

  annuals.forEach((annual: any) => {
    data.transactions.forEach((transaction: any) => {
      if (new Date(transaction.id).getFullYear() === annual.year) {
        const indexMonth = new Date(transaction.id).getMonth();

        if (transaction.type === 'income') {
          annual.incomes[indexMonth].value += transaction.amount;
        } else if (transaction.type === 'expense') {
          annual.expenses[indexMonth].value += transaction.amount;
        }
      }
    });
  });

  return annuals;
};

const getTransactions = (from: number, to: number) => {
  const data = loadData();

  const dataChart = data.transactions
    .map((transaction: any) => {
      if (transaction.id >= from && transaction.id <= to) {
        return {
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
        };
      }
    })
    .filter((item: any) => item !== undefined);

  const getData = (type: string) => {
    return dataChart
      .filter((data: any) => data.type === type)
      .map((data: any) => data.category)
      .filter((value: number, index: number, self: number[]) => self.indexOf(value) === index) // remove duplicate
      .reduce((accumulator: any, value: any) => {
        return { ...accumulator, [value]: 0 };
      }, {});
  };
  const incomes = getData('income');
  const expenses = getData('expense');

  dataChart.forEach((data: any) => {
    if (data.type === 'income') {
      incomes[data.category] += data.amount;
    } else if (data.type === 'expense') {
      expenses[data.category] += data.amount;
    }
  });

  let totalIncome = 0;
  let totalExpense = 0;
  Object.values(incomes).forEach((value: any) => {
    totalIncome += value;
  });
  Object.values(expenses).forEach((value: any) => {
    totalExpense += value;
  });

  return {
    totalIncome,
    totalExpense,
    incomes,
    expenses,
  };
};

const setDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const addData = (data: any) => {
  const transaction = {
    id: +new Date(),
    date: new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    ...data,
    amount: Number(data.amount),
  };

  addTransaction(transaction);
};

export default {
  getHistory,
  getYears,
  getAnnuals,
  getTransactions,
  setDate,
  addData,
};

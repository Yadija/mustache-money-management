import { ITransaction } from '../interfaces';
import { loadData } from '../utils/data';

const getData = () => {
  const data = loadData();

  const transactions = data.transactions.map((transaction: ITransaction) => {
    // format type
    transaction.type = transaction.type[0].toUpperCase() + transaction.type.slice(1);

    // format category
    transaction.category = transaction.category[0].toUpperCase() + transaction.category.slice(1);

    // format date
    transaction.date = new Date(transaction.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return transaction;
  });

  return {
    ...data,
    transactions,
  };
};

export default {
  getData,
};

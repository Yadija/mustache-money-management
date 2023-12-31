import fs from 'fs';

// interfaces
import { IData } from '../interfaces';

const data: IData = {
  user: 'John Doe',
  image: 'https://ui-avatars.com/api/?name=John+Doe',
  transactions: [],
};

// create folder data if not exist
const dir = './data';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// create file data.json if not exist
const filePath = `${dir}/data.json`;
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

// load data from data.json
const loadData = (): IData => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// save data to data.json
const saveContacts = (data: IData) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// add new data
const addTransaction = (transaction: any) => {
  const data = loadData();
  data.transactions.push(transaction);
  saveContacts(data);
};

// delete data
const deleteTransaction = (id: number): boolean => {
  const data = loadData();
  const findTransaction = data.transactions.findIndex((transaction: any) => {
    return transaction.id === id;
  });

  if (findTransaction == -1) {
    return false;
  }

  data.transactions.splice(findTransaction, 1);
  saveContacts(data);
  return true;
};

export { loadData, addTransaction, deleteTransaction };

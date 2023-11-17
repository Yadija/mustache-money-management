export interface ITransaction {
  id: number;
  type: string;
  category: string;
  amount: number;
  date: string;
}

export interface IData {
  user: string;
  image: string;
  transactions: ITransaction[];
}

interface IMonth {
  month: number;
  value: number;
}

export interface IAnnual {
  year: number;
  incomes: IMonth[];
  expenses: IMonth[];
}

export interface IRequestTransaction {
  type: string;
  category: string;
  amount: string;
}

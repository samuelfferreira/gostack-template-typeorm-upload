import {EntityRepository, Repository} from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const {income, outcome} = transactions.reduce((accumulator, transaction) => {
      switch (transaction.type) {
        case "income":
          accumulator.income += Number(transaction.value);
          break;
        case "outcome":
          accumulator.outcome += Number(transaction.value);
          break;
        default:
          break;
      }
      return accumulator;
    }, {
      income: 0,
      outcome: 0,
      total: 0
    })

    const total = income - outcome;

    return {income, outcome, total}


    // const transactions = await this.find();
    //
    // const income = transactions.reduce((incomeTotal, transiction) => {
    //   return (
    //     incomeTotal + (transiction.type === 'income' ? transiction.value : 0)
    //   );
    // }, 0);
    // const outcome = transactions.reduce((outcomeTotal, transiction) => {
    //   return (
    //     outcomeTotal + (transiction.type === 'outcome' ? transiction.value : 0)
    //   );
    // }, 0);
    //
    // const balance = {
    //   income,
    //   outcome,
    //   total: income - outcome,
    // };
    //
    // return balance;
  }
}

export default TransactionsRepository;

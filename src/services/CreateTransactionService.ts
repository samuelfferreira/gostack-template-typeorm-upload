import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import {getCustomRepository, getRepository} from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";
import Category from "../models/Category";

interface RequestDto {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category}: RequestDto): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const {total} = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError(
        'Saldo insuficiente'
      );
    }

    let categoryExist = await categoryRepository.findOne({
      where:
        {
          title: category
        }
    });

    if (!categoryExist) {
      categoryExist = categoryRepository.create({
        title: category
      });
      await categoryRepository.save(categoryExist);
    }

    const transaction = transactionsRepository.create({
      title: title,
      value: value,
      type: type,
      category: categoryExist
    });

    await transactionsRepository.save(transaction);

    return transaction;

    // if (!categoryExist) {
    //   const createCategory = categoryRepository.create({
    //     title: category
    //   });
    //
    //   console.log(createCategory);
    //
    //   await categoryRepository.save(createCategory);
    //   transaction.category = createCategory;
    //   //transaction.category_id = createCategory.id;
    // } else {
    //   //transaction.category_id = categoryExist.id;
    //   transaction.category = categoryExist;
    // }
    //
    // await transactionsRepository.save(transaction);
    //
    // return transaction
  }
}

export default CreateTransactionService;

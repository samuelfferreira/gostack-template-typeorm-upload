import AppError from '../errors/AppError';
import {getCustomRepository} from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface RequestDto {
  id: string
}

class DeleteTransactionService {
  public async execute({id}: RequestDto): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw  new AppError('Transacao nao encontrada');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;

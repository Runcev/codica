import Database from "../common/dbConfig";
import { ITransaction} from "../domain/types";
import {Transaction} from "../domain/transaction";
import {Repository} from "typeorm";
import {BankService} from "./bankService";
import {PaginationData} from "./types";


export class TransactionService {
    private readonly transactionRepository: Repository<Transaction>;
    private readonly bankService: BankService;
    constructor() {
        this.transactionRepository = Database.getRepository(Transaction);
        this.bankService = new BankService();
    }

    public async findAll(limit: number, page: number,): Promise<PaginationData<Transaction>> {
        const take = Math.abs(limit) || 10
        const skip = Math.abs(page * take);

        const [result, total] = await this.transactionRepository.findAndCount(
            {
                take: take,
                skip: skip,
                relations: [
                    "categories",
                    "categories.bank"
                ]
            }
        );

        return {
            data: result,
            maxPage: Math.ceil(total / limit),
        }
    }

    public async findOne(id: number): Promise<Transaction | null> {
        return await this.transactionRepository.findOne({
            where: {id},
            relations: {
                categories: {
                    bank: true
                }
            }
        });
    }

    public async updateTransactionBank(id: number, type: string) {
        const transaction = await this.findOne(id);
        const { amount } = transaction;
        const [category] = transaction.categories
        const { bank } = category;

        if(type === 'profitable') {
            bank.balance += amount
        }
        else {
            bank.balance -= amount

        }
        await this.bankService.updateBank(bank.id, bank);
    }

    public async createTransaction(transaction: ITransaction): Promise<Transaction> {
        const createdTransaction = await this.transactionRepository.save(transaction);

        await this.updateTransactionBank(createdTransaction.id, createdTransaction.type);

        return createdTransaction;
    }

    public async remove(id: number): Promise<boolean> {
        const transaction = await this.findOne(id);
        await this.updateTransactionBank(transaction.id, 'consumable');

        let isError = false;
        try {
            await this.transactionRepository.delete(id);
        } catch (e) {
            isError = true;
        }
        return !isError;
    }
}
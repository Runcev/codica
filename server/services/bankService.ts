import Database from "../common/dbConfig";
import { Bank } from "../domain/bank";
import { IBank } from "../domain/types";
import { Repository } from "typeorm";
import {CategoryService} from "./categoryService";
import {Category} from "../domain/category";

export class BankService {
    private readonly bankRepository: Repository<Bank>;
    private readonly categoryRepository: Repository<Category> ;

    constructor() {
        this.bankRepository = Database.getRepository(Bank);
        this.categoryRepository = Database.getRepository(Category);
    }

    public async findAll(): Promise<Bank[] | null> {
        return await this.bankRepository.find(
            {relations: {categories: true}}
        );
    }

    public findOne(id: number): Promise<Bank | null> {
        return this.bankRepository.findOne({
            where: [{id}],
            relations: {categories: true}
        })
    }

    public async createBank(bank: IBank): Promise<Bank> {
        const createdBank: IBank = await this.bankRepository.save(bank);
        return this.findOne(createdBank.id);
    }

    public async updateBank(id: number, updatedBank: IBank): Promise<Bank> {
        await this.bankRepository.update(id, updatedBank);
        return this.findOne(id);
    }

    public async remove(id: number): Promise<boolean> {
        const bank = await this.bankRepository.findOne({
            where: { id },
            relations: [
                "categories",
                "categories.transactions"
            ]
        });

        if(bank.categories.some(category => category.transactions.length > 0 )) {
            return false
        }

        let isError = false;
        try {
            await this.bankRepository.delete(id);
        } catch (e) {
            isError = true;
        }
        return !isError;
    }
}
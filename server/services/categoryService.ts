import Database from "../common/dbConfig";
import { ICategory } from "../domain/types";
import { Category } from "../domain/category";
import { In, Repository } from "typeorm";

export class CategoryService {
    private readonly categoryRepository: Repository<Category>;

    constructor() {
        this.categoryRepository = Database.getRepository(Category)
    }

    public findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            relations: {
                bank: true,
            }
        });
    }

    public findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: [{id}],
            relations: {
                bank: true,
                transactions: true,
            }
        });
    }

    public async getCategoryByIds(ids: number []): Promise<Category[]> {
        return await this.categoryRepository.find({ where: { id: In(ids) }});
    }

    public async getCategoryStatistics(ids: number[], fromPeriod: Date, toPeriod: Date){
        let finalData = [];

       /* const categoriesWithTransaction = await this.categoryRepository.find( {
            where: [
                {
                    id: In(ids)
                }
            ],
            relations: { transactions: true },
        })*/
        const categoriesWithTransaction = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.transactions', "transaction")
            .where("category.id = ANY(:ids)", {ids})
            .andWhere("transaction.createdAt > :fromPeriod", {fromPeriod})
            .andWhere("transaction.createdAt < :toPeriod", {toPeriod})
            .getMany()

        categoriesWithTransaction.map(category => {
            const total = category.transactions.reduce((accum, item) => item.type === 'profitable' ? accum + item.amount : accum - item.amount , 0)

            finalData.push({
                category: category.name,
                total
            })
        })

        return finalData
    }

    public async createCategory(category: ICategory): Promise<Category> {
        const createdCategory: ICategory = await this.categoryRepository.save(category);
        return this.findOne(createdCategory.id);
    }

    public async updateCategory(id: number, updatedCategory: ICategory): Promise<Category> {
        await this.categoryRepository.update(id, updatedCategory);

        return this.findOne(id);
    }

    public async remove(id: number): Promise<boolean> {
        const category = await this.findOne(id);
        if(category.transactions.length === 0) {
            let isError = false;
            try {
                await this.categoryRepository.delete(id);
            } catch (e) {
                isError = true;
            }
            return !isError
        }
        else {
            return false
        }
    }
}
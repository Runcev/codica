import {
    Column,
    CreateDateColumn,
    Entity, ManyToMany, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Transaction} from "./transaction";
import {Bank} from "./bank";
import {ICategory} from "./types";

@Entity('categories')
export class Category implements ICategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @ManyToOne(() => Bank, (bank) => bank.categories, {
        nullable: false,
        createForeignKeyConstraints: false,
    })
    bank: Bank;

    @ManyToMany(() => Transaction, (transaction) => transaction.categories)
    transactions: Transaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
import {
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Category} from "./category";
import {ITransaction} from "./types";
import {ColumnNumericTransformer} from "../common/transform";


@Entity('transactions')
export class Transaction implements ITransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'decimal',
        precision: 15,
        scale: 5,
        transformer: new ColumnNumericTransformer()
    })
    amount: number;

    @Column ({ type: 'varchar' })
    type: string;

    @ManyToMany(() => Category,(category) => category.transactions, {
        eager: true,
        cascade: true,
    })
    @JoinTable({
        name: 'transaction_category',
        joinColumn: {
            name: 'transaction_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
        synchronize: true
    })
    categories: Category[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Category} from "./category";
import { IBank } from './types';
import {ColumnNumericTransformer} from "../common/transform";

@Entity('banks')
export class Bank implements IBank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({
        type: 'decimal',
        precision: 15,
        scale: 5,
        default: 0,
        transformer: new ColumnNumericTransformer()
    })
    balance: number;

    @OneToMany(() => Category, (category) => category.bank, {
        nullable: true,
        createForeignKeyConstraints: false,
    })
    categories: Category[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
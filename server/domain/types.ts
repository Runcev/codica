import {Category} from "./category";
import {Bank} from "./bank";
import {Transaction} from "./transaction";

export interface IBank {
    id: number;
    name: string;
    balance: number;
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICategory {
    id: number;
    name: string;
    bank: Bank;
    transactions: Transaction[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransaction {
    id: number;
    amount: number;
    type: string;
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateTransactionDTO {
    amount: number;
    type: string;
    categories: number[] | Category[];
}
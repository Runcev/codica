import {DataSource} from "typeorm";
import {Bank} from "../domain/bank";
import {Category} from "../domain/category";
import {Transaction} from "../domain/transaction";


const Database = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "17052001",
    database: "codica",
    synchronize: true,
    logging: false,
    entities: [Bank, Category, Transaction],
})

export default Database
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import {useExpressServer} from "routing-controllers";
import Database from "./common/dbConfig";
import {BankController} from "./controllers/bankController";
import {CategoryController} from "./controllers/categoryController";
import {TransactionController} from "./controllers/transactionController";

const PORT = 3000;

Database.initialize()
    .then(() => {
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());

        useExpressServer(app, {
            routePrefix: '/api',
            controllers: [BankController, CategoryController, TransactionController],
            middlewares: []
        });
        app.listen(PORT, () => {
            return console.log(`Listening at  http://localhost:${PORT}`);
        });
        console.log("DB has been initialized!")
    })
    .catch((err) => {
        console.error("Error during DB initialization", err)
    })

import {Body, Delete, Get, JsonController, Param, Post, Req, Res} from "routing-controllers";
import to from "await-to-js";
import {ICreateTransactionDTO, ITransaction} from "../domain/types";
import {TransactionService} from "../services/transactionService";
import {CategoryService} from "../services/categoryService";
import axios from "axios";
import {ITransactionResponse} from "./types";

@JsonController('/transaction')
export class TransactionController {
    private readonly transactionService: TransactionService;
    private readonly categoriesService: CategoryService;

    constructor() {
        this.transactionService = new TransactionService();
        this.categoriesService = new CategoryService();
    }

    @Get('/:limit/:page')
    async getTransactions(@Res() res, @Param('limit') limit: number, @Param('page') page : number) {
        const [err, transactions] = await to(this.transactionService.findAll(limit, page))
        if (err) throw err;

        return res.status(200).send({
            status: 'success',
            transactions,
        });
    }

    @Get('/:id')
    async getTransactionById(@Req() req, @Res() res, @Param('id') id: number) {
        const [err, transaction] = await to(this.transactionService.findOne(id));
        if (err) throw err;

        if(!transaction) {
            return res.status(400).send({
                status: "fail",
                message: "Transaction with this id do not exists"
            })
        }

        return res.status(200).send({
            status: 'success',
            transaction,
        });
    }


    @Post('/')
    async createTransaction(@Req() req, @Res() res, @Body() body: ICreateTransactionDTO) {
        body.categories = await this.categoriesService.getCategoryByIds(body.categories as number []);

        const [err, transaction] = await to(this.transactionService.createTransaction(body as ITransaction));
        if (err)  {
            await TransactionController.sendWebhookResponse({
                status : "fail",
                message: "Error in transaction processing"
            })
            throw err;
        }

        await TransactionController.sendWebhookResponse({
            status : "success",
            message: 'Transaction successfully processing',
            transactionId: transaction.id.toString()
        })

        return res.status(200).send({
            status: 'success',
            transaction,
        });
    }

    @Delete('/:id')
    async deleteBank(@Req() req, @Res() res, @Param('id') id: number) {
        const [err, existingTransaction] = await to(this.transactionService.findOne(id));
        if (err) throw err;

        if (!existingTransaction) {
            return res.status(400).send({
                status: "fail",
                message: "Transaction with this id do not exists"
            })
        }
        const [err2, deleted] = await to(this.transactionService.remove(id));
        if (err2) throw err2;

        return res.status(200).send({
            status: 'success',
            deleted,
        });
    }

    private static async sendWebhookResponse(transactionInfo: ITransactionResponse){
        // Your url
        const [err] = await to(axios.post("https://webhook.site/8ddadf45-03f5-464c-94cc-f9802fe5fab5", transactionInfo));
        if (err) throw err;
    }
}

import {Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res} from "routing-controllers";
import to from "await-to-js";
import {BankService} from "../services/bankService";
import {IBank} from "../domain/types";

@JsonController('/bank')
export class BankController {
    private readonly bankService: BankService;

    constructor() {
        this.bankService = new BankService();
    }

    @Get('/')
    async getBanks(@Res() res) {
        const [err, banks] = await to(this.bankService.findAll())
        if (err) throw err;

        return res.status(200).send({
            status: 'success',
            banks,
        });
    }

    @Get('/:id')
    async getBankById(@Req() req, @Res() res, @Param('id') id: number) {
        const [err, bank] = await to(this.bankService.findOne(id));
        if (err) throw err;

        if(!bank) {
            return res.status(400).send({
                status: "fail",
                message: "Bank with this id do not exists"
            })
        }

        return res.status(200).send({
            status: 'success',
            bank,
        });
    }


    @Post('/')
    async createBank(@Req() req, @Res() res, @Body() body: IBank) {
        const [err, bank] = await to(this.bankService.createBank(body))
        if (err) throw err;

        return res.status(200).send({
            status: 'success',
            bank,
        });
    }

    @Patch('/:id')
    async updateBankById(@Req() req, @Res() res, @Body() body: IBank, @Param('id') id: number) {
        const [err, existingBank] = await to(this.bankService.findOne(id));
        if (err) throw err;

        if (!existingBank) {
            return res.status(400).send({
                status: "fail",
                message: "Bank with this id do not exists"
            })
        }

        const [err2, bank] = await to(this.bankService.updateBank(id, body));
        if (err2) throw err2;

        return res.status(200).send({
            status: 'success',
            bank,
        });
    }

    @Delete('/:id')
    async deleteBank(@Req() req, @Res() res, @Param('id') id: number) {
        const [err, existingBank] = await to(this.bankService.findOne(id));
        if (err) throw err;

        if (!existingBank) {
            return res.status(400).send({
                status: "fail",
                message: "Bank with this id do not exists"
            })
        }

        const [err2, isDeleted] = await to(this.bankService.remove(id));
        if (err2) throw err2;

        if (!isDeleted) {
            return res.status(400).send({
                status: 'fail',
                message: "Could not delete bank with existing transactions"
            });
        }

        return res.status(200).send({
            status: 'success',
            message: "Bank deleted successfully"
        });
    }
}

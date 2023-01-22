import {Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res} from "routing-controllers";
import to from "await-to-js";
import { ICategory} from "../domain/types";
import { CategoryService } from "../services/categoryService";

@JsonController('/category')
export class CategoryController {
    private readonly categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    @Get('/')
    async getCategories(@Res() res) {
        const [err, category] = await to(this.categoryService.findAll())
        if (err) throw err;

        return res.status(200).send({
            status: 'success',
            category,
        });
    }

    @Get('/statistics')
    async getCategoryStatisticsById(@Req() req, @Res() res, @Body() body) {
        const [err2 , statistics] = await to(this.categoryService.getCategoryStatistics(body.categoryIds, new Date(body.fromPeriod), new Date(body.toPeriod)))
        if (err2) throw err2;

        return res.status(200).send({
            status: 'success',
            statistics,
        });
    }

    @Get('/:id')
    async getCategoryById(@Req() req, @Res() res, @Param('id') id: number) {
        const [err, category] = await to(this.categoryService.findOne(id));
        if (err) throw err;

        if(!category) {
            return res.status(400).send({
                status: "fail",
                message: "Category with this id do not exists"
            })
        }

        return res.status(200).send({
            status: 'success',
            category,
        });
    }


    @Post('/')
    async createCategory(@Req() req, @Res() res, @Body() body: ICategory) {
        const [err, category] = await to(this.categoryService.createCategory(body))
        if (err) throw err;

        return res.status(200).send({
            status: 'success',
            category,
        });
    }

    @Patch('/:id')
    async updateCategoryById(@Req() req, @Res() res, @Body() body: ICategory, @Param('id') id: number) {
        const [err, existingCategory] = await to(this.categoryService.findOne(id));
        if (err) throw err;

        if (!existingCategory) {
            return res.status(400).send({
                status: "fail",
                message: "Category with this id do not exists"
            })
        }

        const [err2, category] = await to(this.categoryService.updateCategory(id, body));
        if (err2) throw err2;

        return res.status(200).send({
            status: 'success',
            category,
        });
    }

    @Delete('/:id')
    async deleteCategory(@Req() req, @Res() res, @Param('id') id: number) {
        const [err, existingCategory] = await to(this.categoryService.findOne(id));
        if (err) throw err;

        if (!existingCategory) {
            return res.status(400).send({
                status: "fail",
                message: "Category with this id do not exists"
            })
        }

        const [err2, isDeleted] = await to(this.categoryService.remove(id));
        if (err2) throw err2;

        if (!isDeleted) {
            return res.status(400).send({
                status: 'fail',
                message: "Could not delete category with existing transactions"
            });
        }

        return res.status(200).send({
            status: 'success',
            message: "Category deleted successfully"
        });
    }
}

import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';


@Controller('/api/transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Post()
    createTransaction(@Body() body : {userId : number, amount : number}) {
        return this.transactionService.createTransaction(body.userId, body.amount);
    }

    @Get(':userId')
    getUserTransactions(@Param('userId') userId : number) {
        return this.transactionService.getTransactions(Number(userId));
    }
}

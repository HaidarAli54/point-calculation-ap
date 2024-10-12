import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/jwt.token';

@Controller('/api/transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    createTransaction(@Body() body : {userId : number, amount : number}) {
        return this.transactionService.createTransaction(body.userId, body.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    getUserTransactions(@Param('userId') userId : number) {
        return this.transactionService.getTransactions(Number(userId));
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async createTransaction(userId : number, amount : number) {
        let points = 0;


        if (amount >= 100000) {
            points = Math.floor(amount / 100000) *10;
        }

        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                amount,
                points
            },
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: { points: { increment: points } }
        });
        return transaction;
    }

    async getTransactions(userId: number) {
        return this.prisma.transaction.findMany({ where: {userId} })
    }
}

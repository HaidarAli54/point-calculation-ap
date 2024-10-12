import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async createTransaction(userId : number, amount : number) {
        let points = 0;


        if (amount >= 20000) {
            points = Math.floor(amount / 20000);
        }

        try {
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
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw new HttpException(
                'Failed to create transaction. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getTransactions(userId: number) {
        return this.prisma.transaction.findMany({ where: {userId} })
    }
}

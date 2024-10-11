import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  providers: [TransactionService, PrismaService],
  controllers: [TransactionController]
})
export class TransactionModule {}

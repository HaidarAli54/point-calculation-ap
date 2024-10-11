import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
    imports: [UserModule, TransactionModule],
    providers: [PrismaService],
})
export class AppModule {}

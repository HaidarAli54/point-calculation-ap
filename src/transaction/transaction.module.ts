import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/jwt.token';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
  }),
  ],
  providers: [TransactionService, JwtAuthGuard, PrismaService],
  controllers: [TransactionController]
})
export class TransactionModule {}

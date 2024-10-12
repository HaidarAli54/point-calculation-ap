import { Module } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';

@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Ekspor PrismaService agar dapat digunakan di module lain
})
export class PrismaModule {}

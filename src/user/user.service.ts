import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(data : { name:string, email: string, password: string }) {
        const userExists = await this.prisma.user.findUnique({ where: { email: data.email } 
        });

        if (userExists) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name : data.name,
                email: data.email,
                password: hashedPassword
            },
        });
        return user;
    }

    async login(data : { email: string, password: string }) {

        const user = await this.prisma.user.findUnique({ where: { email: data.email } });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!data.password) {
            throw new UnauthorizedException('Password is required');
        }

        const passwordValid = await bcrypt.compare(data.password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: { token }
        })

        return { user: updatedUser };
    }

    async findUserById(id:number) {
        const user = await this.prisma.user.findUnique({ where: { id } 
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        return user;
    }

    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } 
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        return user;
    }

    async updateUser(id:number, data: { name?: string, email?: string }) {
        const user = await this.prisma.user.update({
            where: { id },
            data
        })
        return user
    }

    async deleteUser(id:number) {
        try {
            await this.prisma.user.delete({ where: { id } });
            return { message: 'deleted successfully' };
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

}

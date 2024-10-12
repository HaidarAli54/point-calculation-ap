import { Controller, Post, Body, Get, Param, Patch, Delete, Headers, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
@Controller('/api/user')
export class UserController {
    constructor(private UserService: UserService, private jwtService: JwtService) {}

    @Post('register')
    register(@Body() body: { name: string, email: string, password: string }) {
        return this.UserService.register(body);
    }

    @Post('login')
    login(@Body() body: { email: string, password: string }) {
        return this.UserService.login(body);
    }

    @Get(':id')
    findUserById(@Param('id') id: string) {
        const userId = Number(id);
        return this.UserService.findUserById(userId);
    }

    @Get('email/:email')
    findUserByEmail(@Param('email') email: string) {
        return this.UserService.findUserByEmail(email);
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, 
    @Body() updateData: { name?: string, email?: string, password?: string },
    @Headers('Authorization') authorization: string
    ) {
        const userId = Number(id);

        if (!authorization) {
            throw new UnauthorizedException('Authorization header not found');
        }

        const token = authorization.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const decodedToken = this.jwtService.verify(token);
            if (decodedToken.userId !== userId) {
                throw new UnauthorizedException('You are not authorized to update this user');
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        const updatedUser = this.UserService.updateUser(userId, updateData);
        return updatedUser;
    }

    @Delete(':id')
    deletedUser(@Param('id') id: string) {
        return this.UserService.deleteUser(Number(id));
    }
}


import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
@Controller('/api/user')
export class UserController {
    constructor(private UserService: UserService) {}

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
}


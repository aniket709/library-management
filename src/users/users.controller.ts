import { Controller,Post,Body,Get,UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('/users')
export class UsersController {
    constructor(private usersService :UsersService){}

      @Post("/signup")
    
    async signup(@Body() data:any){
        return this.usersService.signup(data);
    }

    @Post("/login")

    async login(@Body() data:any){
        return this.usersService.login(data);
    }

   @UseGuards(JwtAuthGuard)

    @Get("/user")

    async allUser(){

        return this.usersService.getAllUser({});

    }
}

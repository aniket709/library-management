import { Injectable } from "@nestjs/common";

import { IsEmail, IsString, Min } from 'class-validator';

@Injectable()

export class RegisterDto{
    @IsEmail()
    @IsString()
    email:string

    @IsString()
    @Min(5)
    password:string 

    @IsString()
    name:string
}

export class LoginDto{
    @IsEmail()
    @IsString()
    email:string

    
    @IsString()
    password:string
}  
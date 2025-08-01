import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()

export class UsersService {

    constructor(private prisma : PrismaService,
        private jwtService:JwtService){}

    async signup (data:any){

        const hashedPassword = await bcrypt.hash(data.password, 10);

       const userData=  await this.prisma.user.create({
        data:{
            email: data.email,
             name: data.name,
             password:hashedPassword,
        }
       })
       return {userData};   
    }

    async login(data:any){

        const {email,password}= data;

        const registerUser= await this.prisma.user.findUnique({
            where :{
                email
            }
        })
        if (!registerUser){
            throw new Error("email is not registerd");
        }

        const isMatched = await bcrypt.compare(password,registerUser.password);

        if (!isMatched){
            throw new Error("password is not correct");
        }
        const token = this. jwtService.sign({
            id: registerUser.id,
            role: registerUser.role,
        })
      return ({
        message: 'Login successful',
        token,
        id: registerUser.id,
        role: registerUser.role,
      })
    }

 async getAllUser(data:any){

  const allUser=  await this.prisma.user.findMany({})
  return allUser;

 }
}

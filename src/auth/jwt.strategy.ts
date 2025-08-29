
import { Injectable } from "@nestjs/common";
import { ExtractJwt,Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import {  ConfigService } from '@nestjs/config';


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){

  constructor(configService:ConfigService){
    console.log('JwtStrategy constructor loaded ');
  super ({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey:configService.get<string>('JWT_SECRET')!

  })
  console.log('JWT_SECRET in JwtStrategy:', configService.get<string>('JWT_SECRET'));
}

async validate (payload:any){
    console.log('Decoded JWT payload:', payload);  
    return {
        id:payload.id,
        role:payload.role
    }
}
}



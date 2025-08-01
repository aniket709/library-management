import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports:[PrismaModule,AuthModule],
  
  exports:[UsersService]
})
export class UsersModule {}

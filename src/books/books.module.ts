import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports:[PrismaModule]
})
export class BooksModule {}

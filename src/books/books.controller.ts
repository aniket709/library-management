import { Controller, Post, Body, Req, UseGuards, Param, ParseIntPipe,Get, Delete, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post('/createbook')
  async createBook(@Req() req, @Body() data: AddBookDto) {
    const user = req.user;
    console.log('User:', user);

    if (user.role !== 'ADMIN') {
      return { message: 'Only admins can create books' };
    }
    return this.booksService.addBook(data);
  }

   /*-----------------------------------------------------------*/
@UseGuards(AuthGuard('jwt'))
     @Get(':id')
     async findBookById(@Param('id', ParseIntPipe) id :number) {
      return this.booksService.findBook(id);
     }

      /*-----------------------------------------------------------*/
   @UseGuards(AuthGuard('jwt'))
   @Delete(':id')

   async deleteBookById(@Req() req ,@Param('id',ParseIntPipe) id : number){
     const user = req.user;
     
     if (user.role!=='ADMIN'){
      return {msg:"Only admin can deleted books"};
     }
    return this.booksService.deleteBook(id);
   }
 /*-----------------------------------------------------------*/
   @UseGuards(AuthGuard('jwt'))
   @Patch('update/:id')
   async updateBooks( @Body() data: any,
    @Req()req,
    @Param('id',ParseIntPipe )
    id : number){
    const user = req.user;
    if (user.role!=='ADMIN'){
      return{msg:'only user can update Books'}
    }
    return this.booksService.updateBookCount(id,data);
   }
   /*-----------------------------------------------------------*/
   @UseGuards(AuthGuard('jwt'))
   @Post('/borrow/:bookId')
   async borrowBook(
     @Param('bookId', ParseIntPipe) bookId: number,
     @Req() req
   ) {
     const userId = req.user.id;
     return this.booksService.BorrowBook(bookId, userId);
   }

    /*-----------------------------------------------------------*/

   @UseGuards(AuthGuard('jwt'))
   @Post('/buy/:bookId')
   async buyBook(
     @Param('bookId', ParseIntPipe) bookId: number,
     @Req() req
   )
   {
    const userId= req.user.id;
    return this.booksService.buyBook(bookId,userId);
   }
    /*-----------------------------------------------------------*/

   @UseGuards(AuthGuard('jwt'))
   @Post("/return/:transactionId")
   async returnBook( @Param('transactionId',ParseIntPipe)transactionId: number
   ){
     return this.booksService.returnBook(transactionId);
   }

   
}

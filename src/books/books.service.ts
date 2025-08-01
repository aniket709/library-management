import { Injectable } from '@nestjs/common';
import { availableMemory, title } from 'process';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class BooksService {

    constructor(private prisma :PrismaService){}

        /*-----------------------------------------------------------*/

    async addBook(data: any){

      const existingBook = await this.prisma.book.findFirst({
         
        where:{
          title:data.title,
          author:data.author
          }
      })
      if (existingBook){
     const upadteBook = await this.prisma.book.update({

        where:{id:existingBook.id},
        data:{
          totalCopies: existingBook.totalCopies + data.totalCopies,
          availableCopies: existingBook.availableCopies + data.availableCopies,
        }
   })
   return ({
    msg :"author and id are same updated in the existingBook",
    upadteBook
  })
      }
        const newBook = await this.prisma.book.create({

            data:{
            title : data.title,
            author: data.author,
            genre: data.genre,
            totalCopies: data.totalCopies,
            availableCopies:data. availableCopies,
            pricing: {
                create: {
                  buyPrice: data.pricing.buyPrice,
                  borrowPrice: data.pricing.borrowPrice
                }
              }
            }
        })

        return ({newBook})

    }

        /*-----------------------------------------------------------*/

    async findBook(id :number){

      const Books = await this.prisma.book.findUnique({

        where :{id}
      })
    return {Books}
    }
      
        /*-----------------------------------------------------------*/
   
    async updateBookCount(id: number, data: any) {
      const existingBook = await this.prisma.book.findUnique({ where: { id } });
    
      if (!existingBook) {
        throw new Error("Book does not exist");
      }
    
      const newTotal = existingBook.totalCopies + data.totalCopies;
      const newAvailable = existingBook.availableCopies + data.totalCopies;
    
      if (newTotal < 0 || newAvailable < 0) {
        return {
          msg: "Invalid update: total or available copies cannot be negative"
        };
      }
      if (newAvailable > newTotal) {
        return {
          msg: 'Available copies cannot be greater than total copies'
        };
      }
      const addBooks = await this.prisma.book.update({
        where: { id },
        data: {
          totalCopies: newTotal,
          availableCopies: newAvailable
        }
      });
    
      return {
        msg: "Books updated successfully",
        addBooks
      };
    }

        /*-----------------------------------------------------------*/
    async deleteBook(id : number){

      await this.prisma.pricing.delete({
        where: { bookId: id }
      });
      await this.prisma.book.delete({
        where:{id}
      })
      return({msg:"books deleted successfully"})
    }
        /*-----------------------------------------------------------*/

    async BorrowBook(bookId:number,userId:number){

      const availableBook = await this.prisma.book.findUnique({
        where:{id:bookId},
        include: { pricing: true }
      })
       if (! availableBook) {
    return { msg: "Book does not exist" };
  }

  if ( availableBook.availableCopies <= 0) {
    return { msg: "Book is not available for borrow" };
  }

     await this.prisma.book.update({
    where: { id: bookId },
    data: { availableCopies:  availableBook.availableCopies - 1 }
  });
      const transaction = await this.prisma.transaction.create({
        data: {
          userId,
          bookId,
          type: 'BORROW',
          price:  availableBook.pricing?.borrowPrice ?? 0,
          status: 'ONGOING',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        }
      });
      return ({ msg : "Book borrowed successfully",transaction});

    }

        /*-----------------------------------------------------------*/
    async buyBook(bookId:number ,userId:number){

       const existingBook = await this.prisma.book.findUnique({
        where:{
           id :bookId},
           include: { pricing: true }
        
       })
       if (!existingBook){
         
        return ({
          msg : "Book does not exists"
        })
       }

       if (existingBook.availableCopies<=0){
        return ({
          msg: "Book is not available"
        })
       }

       await this.prisma.book.update({
        where:{id:bookId},
        data:{
          availableCopies:existingBook.availableCopies-1
        }
       })

        const transaction = await this.prisma.transaction.create({
          data:{
             userId,
             bookId,
             type:'BUY',
             price:  existingBook.pricing?.buyPrice ?? 0,
             status: 'COMPLETED',
             date:new Date(Date.now())
          }
        })

        return ({
          msg : "Transaction Successfull Book buyed",
          transaction
        })
    }

        /*-----------------------------------------------------------*/
   
        async returnBook(transactionId: number) {
          const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { book: true }
          });
        
          if (!transaction || transaction.status !== 'ONGOING') {
            return { msg: "Invalid or already returned" };
          }
        
          const now = new Date();
          const lateFee = now > transaction.dueDate! ? 50 : 0;
        
          await this.prisma.return.create({
            data: {
              transactionId,
              returnDate: now,
              lateFee,
            },
          });
        
          await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
              status: 'RETURNED',
            },
          });
        
          await this.prisma.book.update({
            where: { id: transaction.bookId },
            data: {
              availableCopies: transaction.book.availableCopies + 1,
            },
          });
        
          return { msg: "Book returned", lateFee };
        }
        

      
}

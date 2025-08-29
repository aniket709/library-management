import { Injectable } from "@nestjs/common";
import { IsInt, IsString, IsOptional,Min,ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

@Injectable()

class PricingDto {
    @IsInt()
    @Min(0)
    buyPrice: number;
  
    @IsInt()
    @Min(0)
    borrowPrice: number;
  }
  
  export class AddBookDto {
    @IsString()
    title: string;
  
    @IsString()
    author: string;
  
    @IsString()
    genre: string;
  
    @IsInt()
    @Min(0)
    totalCopies: number;
  
    @ValidateNested()
    @Type(() => PricingDto)
    pricing: PricingDto;
  }
  
export class updateBookCount{

   @IsInt()
    totalCopies:number
}
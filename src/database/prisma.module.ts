
import { Global,Module  } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()

@Module({

    providers:[PrismaService],
    imports:[],
    exports:[PrismaService]
    

})

export class PrismaModule{}



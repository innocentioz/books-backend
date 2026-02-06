import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AwsService } from 'src/aws/aws.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [BookService, AwsService],
})
export class BookModule {}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Get()
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get("/get/:slug")
  async getAllBookByTitle(@Param("slug") title: string) {
    return this.bookService.getBookByTitle(title)
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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
    return this.bookService.searchBooksByTitle(title)
  }

  @Patch(":id/update")
  async updateBook(@Param("id") book_id: number, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(book_id, dto);
  }

  @Delete(":id/delete")
  async deleteBook(@Param("id") book_id: number) {
    return this.bookService.deleteBook(book_id);
  }
}

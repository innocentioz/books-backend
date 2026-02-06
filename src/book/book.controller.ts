import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createBook(@Body() dto: CreateBookDto, @UploadedFile() file: Express.Multer.File) {
    return this.bookService.createBook(dto, file);
  }

  @Get()
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Post('bulk')
  createMany(@Body() books: CreateBookDto[]) {
    return this.bookService.createMany(books);
  }

  @Get("/find")
  async getAllBookByTitle(@Query("title") title: string) {
    const fixedTitle = decodeURIComponent(title)
    if (fixedTitle) {
      return this.bookService.searchBooksByTitle(fixedTitle)
    }
    return this.bookService.getAllBooks()
  }

  @Patch(":id/update")
  @UseInterceptors(FileInterceptor("file"))
  async updateBook(@Param("id") book_id: number, @Body() dto: UpdateBookDto, @UploadedFile() file: Express.Multer.File) {
    return this.bookService.updateBook(book_id, dto, file);
  }

  @Delete(":id/delete")
  async deleteBook(@Param("id") book_id: number) {
    return this.bookService.deleteBook(book_id);
  }

  @Get("filter")
  async filterBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('publisher') publisher?: string,
    @Query('sort') sort?: 'title' | 'author' | 'publisher',
  ) {
    return this.bookService.filterBooks({ title, author, publisher, sort })
  }
}

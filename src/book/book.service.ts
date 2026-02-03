import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';


@Injectable()
export class BookService {
    constructor(private readonly prismaService: PrismaService) {}

    async getBookById(book_id: number) {
        const book = await this.prismaService.book.findUnique({
            where: {
                id: book_id
            }
        })
        if (!book) {
            throw new NotFoundException({
                message: "Книга не найдена"
            })
        }
        return book;
    }

    async deleteBook(book_id: number) {
        await this.getBookById(book_id)
        return await this.prismaService.book.delete({
            where: {
                id: book_id
            }
        })
    }

    async updateBook(book_id: number, dto: UpdateBookDto) {
        await this.getBookById(book_id);
        const { title, author, publisher } = dto;
        if (!title && !author && !publisher) {
            throw new BadRequestException({
                message: "Должно быть заполнено хотя-бы одно поле"
            })
        }
        try {
            return await this.prismaService.book.update({
                where: { id: book_id },
                data: {
                    title,
                    author,
                    publisher        
                }
            })
        } catch (error) {
            console.error(error);
            throw new BadRequestException({
                message: `Произошла ошибка при обновлении: ${error}`
            })
        }
    }

    async searchBooksByTitle(title: string) {
        const book = this.prismaService.book.findMany({
            where: {
                title: {
                    contains: title,
                    mode: "insensitive"
                }
            }
        })
        if (!book) {
            throw new NotFoundException({
                message: "Книга не найдена"
            })
        }
        return book;
    }

    async getAllBooks() {
        const books = this.prismaService.book.findMany({
            select: {
                title: true,
                author: true,
                publisher: true,
            }
        })
        if (!books) {
            throw new NotFoundException({
                message: "Книги не найдены"
            })
        }
        return books;
    }

    async createBook(dto: CreateBookDto) {
        const { title, author, publisher } = dto;
        if (!title && !author && !publisher) {
            throw new BadRequestException({
                message: "Должно быть заполнено хотя-бы одно поле"
            })
        }
        try {
            return this.prismaService.book.create({
                data: {
                    title,
                    author,
                    publisher
                }
            })
        } catch (error) {
            console.error(error);
            throw new ConflictException({
                message: `Произошла ошибка при создании: ${error}`,
            })
        }
    }
}

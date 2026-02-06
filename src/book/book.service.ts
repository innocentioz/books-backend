import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class BookService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly awsService: AwsService
    ) {}

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
    
    async deleteImage(book_id: number) {
        const book = await this.getBookById(book_id)
        if (book.image_url) {
            const url = new URL(book.image_url);
            const parts = url.pathname.split('/'); 
            parts.shift();
            parts.shift(); 
            const key = parts.join('/'); 

            await this.awsService.deleteFile(key);
        }
    }

    async deleteBook(book_id: number) {
        await this.deleteImage(book_id)

        return await this.prismaService.book.delete({
            where: {
                id: book_id
            }
        })
    }

    async createMany(data: CreateBookDto[]) {
        return this.prismaService.book.createMany({
            data: data,
            skipDuplicates: true,
        })
    }

    async updateBook(book_id: number, dto: UpdateBookDto, file: Express.Multer.File) {
        const book = await this.getBookById(book_id);
        const { title, author, publisher } = dto;

        let imageUrl = book.image_url
        if(file) {
            await this.deleteImage(book_id)

            imageUrl = await this.awsService.uploadFile(file.buffer, file.originalname, 'books', file.mimetype);
        }
        
        const dataToUpdate: any = {};
        if (title) dataToUpdate.title = title;
        if (author) dataToUpdate.author = author;
        if (publisher) dataToUpdate.publisher = publisher;
        if (file) dataToUpdate.image_url = imageUrl;

        try {
            return await this.prismaService.book.update({
                where: { id: book_id },
                data: dataToUpdate
            })
        } catch (error) {
            console.error(error);
            throw new BadRequestException({
                message: `Произошла ошибка при обновлении: ${error}`
            })
        }
    }

    async searchBooksByTitle(title: string) {
        const books = await this.prismaService.book.findMany({
            where: {
                title: {
                    contains: title,
                    mode: "insensitive"
                }
            }
        })
        return books;
    }

    async getAllBooks() {
        const books = this.prismaService.book.findMany()
        if (!books) {
            throw new NotFoundException({
                message: "Книги не найдены"
            })
        }
        return books;
    }

    async createBook(dto: CreateBookDto, file: Express.Multer.File) {
        const { title, author, publisher } = dto;

        if (!title && !author && !publisher) {
            throw new BadRequestException({
                message: "Должно быть заполнено хотя-бы одно поле"
            })
        }

        let url: string | undefined;
        if(file) {
            url = await this.awsService.uploadFile(file.buffer, file.originalname, 'books', file.mimetype);
        }

        try {
            return this.prismaService.book.create({
                data: {
                    title,
                    author,
                    publisher,
                    image_url: url
                }
            })
        } catch (error) {
            console.error(error);
            throw new ConflictException({
                message: `Произошла ошибка при создании: ${error}`,
            })
        }
    }

    async filterBooks(filters: { title?: string, author?: string, publisher?: string, sort?: "title" | "author" | "publisher" }) {
        const { title, author, publisher, sort } = filters

        return this.prismaService.book.findMany({
            where: {
                ...(title && { title: { contains: title, mode: "insensitive" } }),
                ...(author && { author: { contains: author, mode: "insensitive" } }),
                ...(publisher && { publisher: { contains: publisher, mode: "insensitive" } })
            },
            orderBy: sort ? { [sort]: "asc" } : undefined
        })
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(private readonly prismaService: PrismaService) {}

    async getBookByTitle(title: string) {
        return this.prismaService.book.findMany({
            where: {
                title: {
                    contains: title,
                    mode: "insensitive"
                }
            }
        })
    }

    async getAllBooks() {
        return this.prismaService.book.findMany({
            select: {
                title: true,
                author: true,
                publisher: true,
            }
        })
    }

    async createBook(dto: CreateBookDto) {
        const { title, author, publisher } = dto;

        return this.prismaService.book.create({
            data: {
                title,
                author,
                publisher
            }
        })
    }
}

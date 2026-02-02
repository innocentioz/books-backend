
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // Конфиг для подключения к бд
    const host = config.get<String>("POSTGRES_HOST");
    const port = config.get<Number>("POSTGRES_PORT");
    const user = config.get<Number>("POSTGRES_USER");
    const password = config.get<Number>("POSTGRES_PASSWORD");
    const database = config.get<Number>("POSTGRES_DB");

    // Условие, если какая-то переменная в ENV отсутствует
    if (!host || !port || !user || !password || !database) {
      throw new Error("Отсутствует ENV переменная");
    }

    const adapter = new PrismaPg({
      host,
      port,
      user,
      password,
      database
    });
    super({ adapter });
  }
}

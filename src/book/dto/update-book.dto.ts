import { IsString, MaxLength } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @MaxLength(64, { message: "Название книги должно быть не больше 64 символов" })
  title: string;

  @IsString()
  @MaxLength(64, { message: "Имя автора должно быть не больше 64 символов" })
  author: string;

  @IsString()
  @MaxLength(64, { message: "Название издательства должно быть не больше 64 символов" })
  publisher: string;
}
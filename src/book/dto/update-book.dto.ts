import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;
}
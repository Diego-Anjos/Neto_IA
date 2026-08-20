import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
}

export class UpdateConversationDto {
  @IsString()
  @MinLength(1, { message: 'O título é obrigatório.' })
  @MaxLength(200)
  title: string;
}

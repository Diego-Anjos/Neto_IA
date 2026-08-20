import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @MinLength(1, { message: 'A mensagem de feedback é obrigatória.' })
  @MaxLength(4000)
  message: string;
}
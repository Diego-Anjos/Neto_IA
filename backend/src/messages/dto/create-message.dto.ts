import { Allow, IsDefined, IsIn, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID('4', { message: 'Conversa inválida.' })
  conversationId: string;

  @IsIn(['user', 'assistant'], {
    message: 'O papel da mensagem deve ser user ou assistant.',
  })
  role: 'user' | 'assistant';

  @Allow()
  @IsDefined({ message: 'O conteúdo da mensagem é obrigatório.' })
  content: string | unknown[];
}

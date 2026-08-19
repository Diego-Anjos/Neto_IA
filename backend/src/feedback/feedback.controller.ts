import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(
    @Body()
    body: {
      message: string;
      userId?: string | null;
    },
  ) {
    return this.feedbackService.create(body.message, body.userId);
  }
}

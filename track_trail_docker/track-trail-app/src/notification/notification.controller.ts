import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.services';


@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
async sendNotification(
  @Body() body: { deviceToken: string; title: string; body: string }
) {
  try {
    const response = await this.notificationService.sendNotificationMessage({
      token: body.deviceToken,
      title: body.title,
      body: body.body,
    });
    return { message: 'Notificación enviada', response };
  } catch (error) {
    return { message: 'Error al enviar la notificación', error: error.message };
  }
}
}
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../tracktraillogin-firebase-adminsdk-i2xrt-7207f8713e.json';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      this.logger.log('✅ Firebase inicializado correctamente.');
    } else {
      this.logger.log('⚠️ Firebase ya estaba inicializado.');
    }
  }

  // async sendNotificationLikeProduct(message: any): Promise<void> {
  //   try {
  //     const mensaje = {
  //       data: {
  //         title: message.title,
  //         body: message.body,
  //         icon: 'https://i.imgur.com/AFLnZ3A.png', 
  //       },
  //       token: message.token,
  //     };
  //     const response = await admin.messaging().send(mensaje);
  //     this.logger.log(`✅ Notificación del like enviada con éxito: ${response}`);
  //   } catch (error) {
  //     this.logger.error(`❌ Error al enviar la notificación: ${error.message}`);
  //     throw new HttpException('Error enviando la notificación', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
  
  async sendNotificationMessage(message: any): Promise<void> {
      try {
        const mensaje = {
          notification: {
            title: message.title,
            body: message.body,
          },
          data: { 
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            type: "message",
          },
          token: message.token,
        };
  
        const response = await admin.messaging().send(mensaje);
      this.logger.log(`✅ Notificación de mensaje enviada con éxito: ${response}`);
    } catch (error) {
      this.logger.error(`❌ Error al enviar la notificación: ${error.message}`);
      throw new HttpException('Error enviando la notificación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

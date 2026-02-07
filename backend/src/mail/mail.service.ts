import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @InjectRepository(PortfolioSettings)
    private settingsRepo: Repository<PortfolioSettings>,
  ) {}

  private async createTransporter() {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    
    if (!settings || !settings.enable_email_sending || !settings.smtp_host) {
      if (!settings?.enable_email_sending) this.logger.warn('Email sending is disabled in settings');
      if (!settings?.smtp_host) this.logger.warn('SMTP host is not configured');
      return null;
    }

    return nodemailer.createTransport({
      host: settings.smtp_host,
      port: settings.smtp_port || 587,
      secure: settings.smtp_secure || false, // true for 465, false for other ports
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      },
      tls: {
        rejectUnauthorized: settings.smtp_require_tls ?? true
      }
    });
  }

  // Helper method to create transporter from provided settings (for testing)
  private createTransporterFromSettings(settings: any) {
    return nodemailer.createTransport({
      host: settings.host,
      port: settings.port || 587,
      secure: settings.secure || false,
      auth: {
        user: settings.user,
        pass: settings.pass,
      },
      tls: {
        rejectUnauthorized: settings.require_tls ?? true
      }
    });
  }

  async sendContactNotification(contact: any) {
    try {
      const transporter = await this.createTransporter();
      if (!transporter) return false;

      const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
      const from = settings?.smtp_from || '"Portfolio Contact" <no-reply@portfolio.com>';
      const to = settings?.email; // Send to admin email

      if (!to) {
        this.logger.warn('No contact email configured in settings to receive notifications');
        return false;
      }

      const info = await transporter.sendMail({
        from,
        to,
        replyTo: contact.email,
        subject: `[Portfolio] Nuevo mensaje: ${contact.subject || 'Sin asunto'}`,
        html: `
          <h3>Nuevo mensaje de contacto</h3>
          <p><strong>Nombre:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Asunto:</strong> ${contact.subject || 'Sin asunto'}</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p style="white-space: pre-wrap;">${contact.message}</p>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">
            Enviado desde tu Portfolio Web
          </p>
        `,
      });

      this.logger.log(`Message sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending email', error);
      return false;
    }
  }

  async sendTestEmail(settings: any) {
    try {
      const transporter = this.createTransporterFromSettings(settings);
      
      const info = await transporter.sendMail({
        from: settings.from || '"Test" <no-reply@test.com>',
        to: settings.to,
        subject: 'Test de configuración SMTP - Portfolio',
        html: `
          <h3>✅ Configuración SMTP Correcta</h3>
          <p>Este es un correo de prueba para verificar la configuración de tu servidor SMTP.</p>
          <ul>
            <li><strong>Host:</strong> ${settings.host}</li>
            <li><strong>Port:</strong> ${settings.port}</li>
            <li><strong>Secure:</strong> ${settings.secure ? 'Sí' : 'No'}</li>
          </ul>
        `,
      });

      this.logger.log(`Test email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending test email', error);
      throw error;
    }
  }
}

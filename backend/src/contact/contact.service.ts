import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
    @InjectRepository(PortfolioSettings)
    private settingsRepo: Repository<PortfolioSettings>,
    private mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto, ip_address?: string) {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    
    // Check if contact form is enabled
    if (settings && !settings.enable_contact_form) {
      throw new Error('Contact form is disabled');
    }

    let savedContact = null;

    // Save to database if enabled
    if (!settings || settings.enable_database_storage) {
      const contact = this.contactRepo.create({
        ...createContactDto,
        ip_address
      });
      savedContact = await this.contactRepo.save(contact);
    }

    // Send email notification if enabled
    if (settings && settings.enable_email_sending) {
      // Run in background to not block response
      this.mailService.sendContactNotification(createContactDto).catch(err => {
        this.logger.error('Failed to send contact notification email', err);
      });
    }

    return savedContact || { success: true, message: 'Message sent successfully' };
  }

  async findAll() {
    return this.contactRepo.find({ order: { created_at: 'DESC' } });
  }

  async markAsRead(id: number) {
    await this.contactRepo.update(id, { read: true });
    return this.contactRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    return this.contactRepo.delete(id);
  }
}

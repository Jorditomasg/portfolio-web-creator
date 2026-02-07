import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from '../entities/contact.entity';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, PortfolioSettings])
  ],
  controllers: [ContactController],
  providers: [ContactService, MailService],
  exports: [ContactService]
})
export class ContactModule {}

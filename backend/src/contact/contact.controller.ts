import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Ip } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MailService } from '../mail/mail.service';

@Controller('')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly mailService: MailService
  ) {}

  // Public endpoint for contact form submission
  // Rate limited by ThrottlerGuard (configured in AppModule)
  @UseGuards(ThrottlerGuard)
  @Post('contact')
  async create(@Body() createContactDto: CreateContactDto, @Ip() ip: string) {
    return this.contactService.create(createContactDto, ip);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/contacts')
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/contacts/:id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/contacts/:id')
  remove(@Param('id') id: string) {
    return this.contactService.delete(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/contact/test-email')
  async testEmail(@Body() settings: any) {
    return this.mailService.sendTestEmail(settings);
  }
}

import { Controller, Post, UseInterceptors, UploadedFile, Delete, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const path = this.uploadService.saveFile(file);
    return { path };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteFile(@Body('path') path: string) {
      if (!path) {
          throw new BadRequestException('Path is required');
      }
      this.uploadService.deleteFile(path);
      return { message: 'File deleted successfully' };
  }
}

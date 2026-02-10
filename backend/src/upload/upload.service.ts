import { Injectable, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  saveFile(file: Express.Multer.File): string {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = join(this.uploadDir, fileName);

    writeFileSync(filePath, file.buffer);

    // Return the relative path to be stored in the DB
    return `/uploads/${fileName}`; 
  }

  deleteFile(filePath: string): void {
    if (!filePath) return;

    // Convert relative URL path back to file system path
    // Remove leading slash if present
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    // Only allow deleting files in the uploads directory for security
    if (!cleanPath.startsWith('uploads/')) {
        console.warn(`Attempted to delete file outside of uploads directory: ${filePath}`);
        return;
    }

    const absolutePath = join(process.cwd(), cleanPath);

    if (existsSync(absolutePath)) {
      try {
        unlinkSync(absolutePath);
        console.log(`Deleted file: ${absolutePath}`);
      } catch (error) {
        console.error(`Error deleting file: ${absolutePath}`, error);
      }
    } else {
        console.warn(`File not found for deletion: ${absolutePath}`);
    }
  }
}

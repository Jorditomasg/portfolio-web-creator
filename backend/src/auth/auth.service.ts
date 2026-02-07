import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, username: user.username, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async createUser(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    return this.userRepository.save(user);
  }
}

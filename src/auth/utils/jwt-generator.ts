import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGenerator {
  constructor(private jwtService: JwtService) {}

  /**
   * Generate a JWT token for testing purposes
   * In production, this would be handled by a proper authentication service
   */
  generateTestToken(payload: {
    sub: string;
    username?: string;
    email?: string;
    roles?: string[];
  }): string {
    return this.jwtService.sign(payload);
  }

  /**
   * Generate a test token with default values
   */
  generateDefaultTestToken(): string {
    return this.generateTestToken({
      sub: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com',
      roles: ['user'],
    });
  }
}

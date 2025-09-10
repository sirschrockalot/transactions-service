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
   * Generate a JWT token that doesn't expire
   * Useful for service-to-service authentication
   */
  generateNonExpiringToken(payload: {
    sub: string;
    username?: string;
    email?: string;
    roles?: string[];
  }): string {
    // Use a very long expiration time (1 year)
    return this.jwtService.sign(payload, { expiresIn: '365d' });
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

  /**
   * Generate a non-expiring token for dealcycle user
   * This token can be used by calling applications for service-to-service authentication
   */
  generateDealcycleToken(): string {
    return this.generateNonExpiringToken({
      sub: 'dealcycle-user-id',
      username: 'dealcycle',
      email: 'dealcycle@example.com',
      roles: ['user', 'service'],
    });
  }
}

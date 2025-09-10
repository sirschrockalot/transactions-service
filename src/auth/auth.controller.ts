import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { JwtGenerator } from './utils/jwt-generator';

export class LoginDto {
  username: string;
  password: string;
}

export class TokenResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private jwtGenerator: JwtGenerator) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login and get JWT token (for testing)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    // This is a simple test implementation
    // In production, you would validate credentials against a database
    if (loginDto.username && loginDto.password) {
      const token = this.jwtGenerator.generateTestToken({
        sub: 'user-' + Date.now(),
        username: loginDto.username,
        email: `${loginDto.username}@example.com`,
        roles: ['user'],
      });

      return {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 86400, // 24 hours
      };
    }

    throw new Error('Invalid credentials');
  }

  @Get('test-token')
  @Public()
  @ApiOperation({ summary: 'Generate a test JWT token' })
  @ApiResponse({ status: 200, description: 'Test token generated', type: TokenResponseDto })
  async getTestToken(): Promise<TokenResponseDto> {
    const token = this.jwtGenerator.generateDefaultTestToken();

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400, // 24 hours
    };
  }

  @Get('dealcycle-token')
  @Public()
  @ApiOperation({ summary: 'Generate a non-expiring JWT token for dealcycle user' })
  @ApiResponse({ status: 200, description: 'Dealcycle token generated', type: TokenResponseDto })
  async getDealcycleToken(): Promise<TokenResponseDto> {
    const token = this.jwtGenerator.generateDealcycleToken();

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 0, // Non-expiring token
    };
  }
}

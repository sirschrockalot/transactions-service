# JWT Authentication Implementation

This document explains how JWT authentication has been implemented in the Transactions Service.

## Overview

The service now uses JWT (JSON Web Tokens) to secure all endpoints except for the health check endpoint. All transaction-related endpoints require a valid JWT token in the Authorization header.

## Authentication Flow

1. **Get a JWT Token**: Use the `/auth/test-token` endpoint to get a test token, or `/auth/login` for a more realistic login flow
2. **Include Token in Requests**: Add the token to the `Authorization` header as `Bearer <token>`
3. **Access Protected Endpoints**: All transaction endpoints are now protected and require authentication

## Endpoints

### Authentication Endpoints

#### GET `/auth/test-token`
- **Description**: Generate a test JWT token for development/testing
- **Authentication**: Not required (public endpoint)
- **Response**: 
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
  ```

#### POST `/auth/login`
- **Description**: Login with username/password to get a JWT token
- **Authentication**: Not required (public endpoint)
- **Request Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Response**: Same as test-token endpoint

### Protected Endpoints

All transaction endpoints now require JWT authentication:

- `GET /transactions` - Get all transactions
- `POST /transactions` - Create a new transaction
- `GET /transactions/:id` - Get transaction by ID
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `POST /transactions/:id/activities` - Add activity to transaction
- `POST /transactions/:id/documents` - Upload document
- And all other transaction endpoints...

### Public Endpoints

- `GET /health` - Health check (no authentication required)

## Usage Examples

### Using curl

1. **Get a test token**:
   ```bash
   curl -X GET http://localhost:3003/auth/test-token
   ```

2. **Use the token to access protected endpoints**:
   ```bash
   curl -X GET http://localhost:3003/transactions \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

3. **Create a transaction with authentication**:
   ```bash
   curl -X POST http://localhost:3003/transactions \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "address": "123 Main St",
       "city": "Anytown",
       "state": "CA",
       "contractDate": "2024-01-15"
     }'
   ```

### Using JavaScript/Fetch

```javascript
// Get a test token
const tokenResponse = await fetch('http://localhost:3003/auth/test-token');
const { access_token } = await tokenResponse.json();

// Use the token for authenticated requests
const transactionsResponse = await fetch('http://localhost:3003/transactions', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
});

const transactions = await transactionsResponse.json();
```

## Configuration

### Environment Variables

The JWT configuration is controlled by these environment variables:

- `JWT_SECRET`: Secret key used to sign JWT tokens (change this in production!)
- `JWT_EXPIRES_IN`: Token expiration time (default: 24h)

### Example .env configuration:
```env
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## Security Features

1. **Global JWT Guard**: All endpoints are protected by default
2. **Public Decorator**: Use `@Public()` decorator to make specific endpoints public
3. **User Context**: Authenticated user information is available in controllers via `@GetCurrentUser()` decorator
4. **Token Validation**: JWT tokens are validated on every request
5. **Expiration**: Tokens automatically expire after the configured time

## User Context

When authenticated, you can access the current user information in your controllers:

```typescript
@Post()
create(
  @Body() createTransactionDto: CreateTransactionDto,
  @GetCurrentUser() user: CurrentUser,
) {
  // user.userId - The user ID from the JWT token
  // user.username - The username from the JWT token
  // user.email - The email from the JWT token
  // user.roles - Array of user roles
  
  return this.transactionsService.create(createTransactionDto, user.userId);
}
```

## Development Notes

- The current implementation includes test endpoints for easy development
- In production, you should implement proper user authentication against a database
- The JWT secret should be a strong, randomly generated string
- Consider implementing refresh tokens for better security
- Add rate limiting to authentication endpoints

## Testing

You can test the authentication by:

1. Starting the service: `npm run start:dev`
2. Getting a test token: `curl http://localhost:3003/auth/test-token`
3. Using the token to access protected endpoints
4. Verifying that requests without tokens are rejected with 401 Unauthorized

## Production Considerations

1. **Replace test endpoints**: Remove or secure the test token generation endpoints
2. **Implement proper user management**: Add user registration, password hashing, etc.
3. **Use strong JWT secrets**: Generate cryptographically secure secrets
4. **Add refresh tokens**: Implement token refresh mechanism
5. **Add logging**: Log authentication attempts and failures
6. **Rate limiting**: Add rate limiting to authentication endpoints
7. **HTTPS**: Always use HTTPS in production

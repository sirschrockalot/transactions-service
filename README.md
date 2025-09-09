# Transactions Service

A comprehensive backend service for managing real estate transactions in the Presidential Digs CRM system.

## Features

- **Transaction Management**: Full CRUD operations for real estate transactions
- **Status Tracking**: Track transaction progress through various stages
- **Document Management**: Upload and manage transaction documents
- **Activity Feed**: Real-time messaging and activity tracking
- **Agent Management**: Track acquisitions and dispositions agents
- **Title & Lender Integration**: Manage title company and lender information
- **JWT Authentication**: Secure endpoints with JSON Web Token authentication
- **MongoDB Integration**: Persistent data storage with MongoDB
- **RESTful API**: Complete REST API with Swagger documentation
- **File Upload**: Support for document uploads with validation

## API Endpoints

### Transactions
- `GET /api/v1/transactions` - Get all transactions
- `GET /api/v1/transactions/:id` - Get transaction by ID
- `POST /api/v1/transactions` - Create new transaction
- `PATCH /api/v1/transactions/:id` - Update transaction
- `PATCH /api/v1/transactions/:id/status` - Update transaction status
- `DELETE /api/v1/transactions/:id` - Delete transaction

### Activities
- `POST /api/v1/transactions/:id/activities` - Add activity/message
- `POST /api/v1/transactions/:id/activities/:activityId/like` - Like activity
- `DELETE /api/v1/transactions/:id/activities/:activityId` - Remove activity

### Documents
- `POST /api/v1/transactions/:id/documents` - Upload document
- `DELETE /api/v1/transactions/:id/documents/:documentId` - Remove document

### Statistics
- `GET /api/v1/transactions/stats` - Get transaction statistics
- `GET /api/v1/transactions/coordinator/:name` - Get transactions by coordinator

### Authentication
- `GET /auth/test-token` - Get test JWT token (public)
- `POST /auth/login` - Login and get JWT token (public)

### Health
- `GET /health` - Health check endpoint (public)

## Transaction Statuses

- `gathering_docs` - Gathering Documents
- `holding_for_funding` - Holding for Funding
- `gathering_title` - Gathering Title
- `client_help_needed` - Client Help Needed
- `on_hold` - On Hold
- `pending_closing` - Pending Closing
- `ready_to_close` - Ready to Close
- `closed` - Closed
- `cancelled` - Cancelled

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 7.0+
- Docker (optional)

### Installation

1. Clone the repository
2. Navigate to the Transactions-Service directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment file:
   ```bash
   cp env.example .env
   ```

5. Update the `.env` file with your configuration

### Running the Service

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

#### Using Docker
```bash
docker-compose up -d
```

### API Documentation

Once the service is running, visit:
- Swagger UI: `http://localhost:3003/api/docs`
- Health Check: `http://localhost:3003/health`

### Authentication

**Important**: All transaction endpoints now require JWT authentication. See [JWT_AUTHENTICATION.md](./JWT_AUTHENTICATION.md) for detailed authentication setup and usage.

Quick start:
1. Get a test token: `GET http://localhost:3003/auth/test-token`
2. Use the token in requests: `Authorization: Bearer <your-token>`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/presidential-digs-crm` |
| `PORT` | Server port | `3003` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_TTL` | Rate limit time window | `60000` |
| `RATE_LIMIT_LIMIT` | Rate limit requests per window | `100` |
| `MAX_FILE_SIZE` | Maximum file upload size | `10485760` |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `JWT_SECRET` | JWT signing secret key | `your-super-secure-jwt-secret-key-change-this-in-production` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `24h` |

## Database Schema

The service uses MongoDB with the following main collections:

### Transactions Collection
- Transaction details (property, seller, buyer info)
- Status tracking
- Document references
- Activity feed
- Timestamps

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

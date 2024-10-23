
# NestJS Money Transfer System

This project is a simple money transfer API built using NestJS and TypeScript. The API allows users to register, view their balance, and transfer money to other users.

## Features

- **User Registration**: Users can sign up with a unique username.
- **Balance Retrieval**: A user can check their balance.
- **Money Transfer**: Users can transfer money to other registered users by providing the recipient's username.
- **Caching**: Redis is used to cache user balance for faster retrieval.
- **JWT Authentication**: Secure access to user-specific routes with JWT-based authentication.
- **Error Handling**: Global exception filters are used to handle errors.
- **Validation**: Custom validation pipes are implemented to validate incoming data.
- **Swagger API Documentation**: The project includes Swagger documentation for the available API endpoints.
- **Graceful Shutdown**: The application handles shutdown signals to ensure proper cleanup.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: Typed JavaScript at any scale.
- **TypeORM**: A powerful ORM for interacting with the PostgreSQL database.
- **Redis**: Used for caching frequently accessed data.
- **PostgreSQL**: The relational database used for storing user and transaction data.
- **JWT**: JSON Web Tokens for secure authentication.
- **Swagger**: API documentation and testing.

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- PostgreSQL
- Redis


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nestjs-money-transfer.git
   cd nestjs-money-transfer
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory (refer to the .env.exapmle file i created for the project to make things easier)and configure the following variables:

   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name

   JWT_SECRET=your-jwt-secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. Run the database migrations:

   ```bash
   npm run typeorm:migration:run
   ```

5. Start the application:

   ```bash
   npm run start
   ```

6. Access the API documentation at:

   ```
   http://localhost:3000/api/docs
   ```



7. The API should now be running on `http://localhost:3000`.

### Running Tests

To run the unit tests, use the following command:

```bash
npm run test
```

## API Endpoints
refer to the ```requests.http``` to make test requests to these endpoints

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in and retrieve a JWT token.
- **GET /users/:id**: Get user details along with their balance.
- **GET /users/:username**: Get user details without balance.
- **POST /transfers**: Transfer money to another user.

## License

This project is licensed under the MIT License.

# Event Booking System API

Backend system for user authentication and event management using JWT.

## Features

- User registration and login with JWT authentication
- Event CRUD operations
- Protected routes for authenticated actions
- Event filtering by date range
- Pagination support for event listing
- Swagger/OpenAPI documentation

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt

## Project Structure

```text
event-booking/
|-- config/
|   |-- db.js
|   `-- swagger.js
|-- controllers/
|   |-- auth.controller.js
|   `-- event.controller.js
|-- middleware/
|   `-- auth.middleware.js
|-- models/
|   |-- event.model.js
|   `-- user.model.js
|-- postman/
|   `-- event-booking-api.postman_collection.json
|-- routes/
|   |-- auth.routes.js
|   `-- event.routes.js
|-- .env
|-- package.json
`-- server.js
```

## Installation

1. Clone the repository.
2. Move into the backend project folder:

   ```bash
   cd event-booking
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root.
5. Add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret_key
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

The API will run at `http://localhost:5000`.

## Environment Variables

Example `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

Note: the project also accepts `MONGODB_URI` for compatibility, but `MONGO_URI` is the recommended variable name for this setup.

## Authentication

Protected routes require a JWT in the `Authorization` header:

```http
Authorization: Bearer <your_token>
```

## API Endpoints

### Primary API Routes

| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | `/` | Public | Welcome route |
| POST | `/api/register` | Public | Register a new user |
| POST | `/api/login` | Public | Login and receive JWT token |
| GET | `/api/events` | Public | Get all events with filtering and pagination |
| POST | `/api/events` | Protected | Create a new event |
| PUT | `/api/events/:id` | Protected | Update an existing event |
| DELETE | `/api/events/:id` | Protected | Delete an event |
| GET | `/api-docs` | Public | Swagger UI documentation |

### Legacy Route Aliases

| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive JWT token |
| GET | `/events` | Public | Get all events with filtering and pagination |
| POST | `/events` | Protected | Create a new event |
| PUT | `/events/:id` | Protected | Update an existing event |
| DELETE | `/events/:id` | Protected | Delete an event |

### Query Parameters for Event Listing

`GET /api/events`

| Parameter | Type | Description |
|-----------|------|-------------|
| `start` | string | Start date in `YYYY-MM-DD` format |
| `end` | string | End date in `YYYY-MM-DD` format |
| `page` | number | Page number |
| `limit` | number | Number of results per page |

Example:

```http
GET /api/events?start=2023-12-01&end=2023-12-31&page=1&limit=10
```

## Swagger Documentation

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

## Example Requests

### Register

```json
{
  "name": "Nikhil Rathour",
  "email": "nikhil@example.com",
  "password": "Password123"
}
```

### Login

```json
{
  "email": "nikhil@example.com",
  "password": "Password123"
}
```

### Create Event

```json
{
  "name": "Tech Conference 2023",
  "date": "2023-12-25",
  "capacity": 100
}
```

## Author

**Nikhil Rathour**

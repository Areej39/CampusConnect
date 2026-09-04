
# CampusConnect

CampusConnect is a full-stack university event and sports day management system. It allows students to explore university events, register for events, manage their registrations, and view event details. Administrators can create and manage events, publish or cancel events, and monitor registrations through an admin dashboard.

## Live Demo

Frontend: https://campus-connect-pi-ten.vercel.app/

Backend API: https://privilege-light-horse.abasthan.app/

Backend health check: https://privilege-light-horse.abasthan.app/

Events API: https://privilege-light-horse.abasthan.app/api/events

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Token expiration handling
- Logout functionality
- Password hashing
- User profile retrieval

### Student Features

- View published events
- Search events
- Filter events by category and status
- Sort events by date
- View complete event details
- Register for events
- View personal registrations
- Cancel registrations
- Submit payment information where required
- View registration status

### Admin Features

- View dashboard statistics
- Create events
- Update events
- Delete events
- Publish events
- Cancel events
- View all registrations
- Search and filter registrations
- Approve or reject registrations
- Manage event capacity
- Monitor event registration counts

### Backend Features

- RESTful API architecture
- MongoDB database
- Mongoose models and schemas
- Query parameters for filtering, searching, sorting, and pagination
- Atomic event seat reservation
- Zod request validation
- JWT authorization middleware
- Admin authorization middleware
- Global error handling
- Not-found middleware
- Helmet security middleware
- CORS configuration
- Express rate limiting
- Environment variable configuration

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- Lucide React
- Framer Motion

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- Zod
- Helmet
- CORS
- Express Rate Limit

### Deployment

- Frontend: Vercel
- Backend: Production API hosting
- Database: MongoDB Atlas

## Project Structure

```text
CampusConnect/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── registrationController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── validations/
│   │   ├── eventValidation.js
│   │   └── registrationValidation.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/Areej39/CampusConnect.git
```

```bash
cd CampusConnect
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

Open another terminal and run:

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

For production, use:

```env
CLIENT_URL=https://campus-connect-pi-ten.vercel.app
```

Do not commit the `.env` file to GitHub.

## Running the Project Locally

### Start the backend

Inside the `server` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### Start the frontend

Inside the `client` directory:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login a user |
| GET | `/api/auth/me` | Get the authenticated user |

### Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Get events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create an event |
| PUT | `/api/events/:id` | Update an event |
| PATCH | `/api/events/:id/publish` | Publish an event |
| PATCH | `/api/events/:id/cancel` | Cancel an event |
| DELETE | `/api/events/:id` | Delete an event |

### Registrations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/registrations/:eventId` | Register for an event |
| GET | `/api/registrations/my` | Get current user's registrations |
| PUT | `/api/registrations/:registrationId/cancel` | Cancel a registration |
| PUT | `/api/registrations/:registrationId/payment` | Submit payment information |
| GET | `/api/registrations` | Get all registrations |
| PATCH | `/api/registrations/:registrationId/approve` | Approve a registration |
| PATCH | `/api/registrations/:registrationId/reject` | Reject a registration |

### Admin Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Get dashboard statistics |

## Event Query Parameters

The events API supports searching, filtering, pagination, and sorting.

Example:

```text
/api/events?status=published&page=1&limit=4&sort=date&order=asc
```

Available query parameters:

| Parameter | Description | Example |
|---|---|---|
| `search` | Search by event title | `search=react` |
| `category` | Filter by event category | `category=workshop` |
| `status` | Filter by event status | `status=published` |
| `page` | Select the page number | `page=1` |
| `limit` | Number of events per page | `limit=4` |
| `sort` | Field used for sorting | `sort=date` |
| `order` | Sorting direction | `order=asc` |

Example requests:

```text
/api/events?search=workshop
```

```text
/api/events?category=sports
```

```text
/api/events?status=published
```

```text
/api/events?page=2&limit=6
```

```text
/api/events?sort=date&order=asc
```

## Event Response Example

```json
{
  "totalEvents": 8,
  "currentPage": 1,
  "totalPages": 2,
  "limit": 6,
  "events": []
}
```

## Database Models

### User

The `User` model stores:

- Name
- Email
- Password
- Role
- Created and updated timestamps

### Event

The `Event` model stores:

- Title
- Normalized title
- Description
- Category
- Date
- Registration deadline
- Location
- Capacity
- Registration fee
- Event status
- Registration count
- Event creator
- Created and updated timestamps

### Registration

The `Registration` model stores:

- Registered user
- Event
- Registration status
- Payment status
- Registration date
- Created and updated timestamps

A compound unique index prevents the same user from registering for the same event more than once.

## Security

The backend includes:

- Password hashing
- JWT authentication
- Protected routes
- Admin authorization
- Request validation
- Helmet security headers
- CORS configuration
- API rate limiting
- Limited JSON request size
- Global error handling
- Environment variables for sensitive configuration

## Important Notes

- Only authenticated users can register for events.
- Only administrators can create, update, publish, cancel, or delete events.
- Event capacity is checked before registration.
- Published events are displayed to students.
- Events without a `published` status are excluded when using the `status=published` filter.
- The frontend uses the deployed backend API in production.
- The backend must be redeployed whenever production server code is changed.

## Future Improvements

- Online payment gateway integration
- Email notifications
- Event image uploads
- QR-code-based attendance
- Student profile management
- Advanced admin analytics
- Export registrations to CSV
- Event reminders
- Improved search indexing
- Automated testing
- CI/CD pipeline
- Production monitoring

## Learning Concepts Covered

- React component development
- React Router
- State management with Redux Toolkit
- Form handling
- API integration with Axios
- REST API design
- Express middleware
- JWT authentication
- Role-based authorization
- MongoDB and Mongoose
- Query parameters
- Searching and filtering
- Pagination
- Sorting
- MongoDB indexes
- Atomic database updates
- Request validation
- Error handling
- CORS
- Security middleware
- Deployment with Vercel and a production backend

## Author

Developed by [Areej39](https://github.com/Areej39).

GitHub: https://github.com/Areej39
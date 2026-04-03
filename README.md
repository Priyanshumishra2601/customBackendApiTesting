# customBackendApiTesting
## Finance Data Processing Backend

### Overview

This project is a backend system for managing financial transactions. It allows users to securely store, access, and analyze their income and expenses. The system includes authentication, role-based access control, and multiple APIs for transaction management and dashboard analytics.

### Tech Stack
Node.js
Express.js
MongoDB
Joi (Validation)
JWT (Authentication)

### Setup Instructions

Clone the repository:

git clone <your-repo-link>

Install dependencies:

npm install

Create a .env file and add:

PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Start the server:

npm run dev

Server will run on:

http://localhost:4000     // i use 5000 port

### Authentication
JWT-based authentication is implemented.
After login, a token is generated.
Use this token in protected routes:
Authorization: Bearer <token>


### API Endpoints
#### Auth
POST /api/auth/register → Register user
POST /api/auth/login → Login user
#### Transactions
POST /api/transactions → Create transaction (Admin only)
GET /api/transactions → Get user transactions
PATCH /api/transactions/:id → Update transaction (Admin only)
DELETE /api/transactions/:id → Delete transaction (Admin only)
#### Dashboard
GET /api/dashboard/totals → Income, Expense, Net
GET /api/dashboard/categories → Category-wise spending
GET /api/dashboard/recent → Recent transactions
GET /api/dashboard/trends → Monthly trends
#### Testing

All APIs were tested using Postman.

Steps followed:
Registered a new user
Logged in to get JWT token
Used token for protected APIs
Tested all endpoints with different inputs

####Edge Cases Covered
Invalid or missing JWT token
Unauthorized access
Invalid MongoDB ID
Incorrect date range
Empty request body
Large query limits
#### Security Features
JWT Authentication
Role-Based Access Control
Input Validation using Joi
Users can access only their own data
####Error Handling

Proper error responses are implemented:

400 → Bad Request
401 → Unauthorized
404 → Not Found
500 → Server Error

#### Features
Add, update, delete transactions
Filter transactions
View financial summary
Category-wise expense tracking
Monthly trend analysis



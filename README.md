# Shop E-Commerce Backend

A robust Node.js backend for an e-commerce platform, featuring modular architecture, secure authentication, RESTful APIs, and integrations with MongoDB and Redis.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Main Models](#main-models)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [License](#license)

---

## Features
- User authentication and authorization (JWT, API keys)
- Product, cart, order, and inventory management
- Discount and comment systems
- Secure HTTP headers (Helmet)
- Request logging (Morgan)
- Response compression
- MongoDB integration (Mongoose)
- Redis integration for caching/pub-sub
- Modular, scalable codebase

## Project Structure
```
shop-ecommerce/
├── .env                  # Environment variables
├── server.js             # App entry point
├── package.json          # Project metadata and dependencies
├── src/
│   ├── app.js            # Express app setup
│   ├── auth/             # Auth logic (API key, permissions)
│   ├── configs/          # Configuration files
│   ├── controllers/      # Request handlers
│   ├── core/             # Core utilities/classes
│   ├── dbs/              # Database initialization
│   ├── helpers/          # Helper functions
│   ├── models/           # Mongoose models
│   ├── postman/          # Postman API collections
│   ├── routes/           # Express routes
│   ├── services/         # Business logic/services
│   ├── tests/            # Test files
│   └── utils/            # General utilities
├── docs/                 # Documentation
├── notes.md              # Project notes
└── README.md             # Project documentation
```

## Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd shop-ecommerce
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory. Example:
```
PORT=3055
API_VERSION=v1
MONGODB_URI=mongodb://localhost:27017/shop-ecommerce
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

## Running the Application
Start the server with:
```bash
npm start
```
The server will run on `http://localhost:3055` by default.

## API Overview
All API endpoints are versioned and protected by API key and permission checks.

**Base URL:** `/[API_VERSION]/api/`

### Main Endpoints
- `/checkout`   – Checkout and order processing
- `/product`    – Product management (CRUD)
- `/discount`   – Discount codes and logic
- `/cart`       – Shopping cart operations
- `/inventory`  – Inventory management
- `/comment`    – Product comments
- `/`           – Access/authentication (login, register, etc.)

### Example: Product API
- `GET    /v1/api/product/`         – List products
- `POST   /v1/api/product/`         – Create product
- `GET    /v1/api/product/:id`      – Get product details
- `PUT    /v1/api/product/:id`      – Update product
- `DELETE /v1/api/product/:id`      – Delete product

> See the `postman/` directory for full API collections and example requests.

## Main Models
- **User/Auth**: Handles user accounts, authentication, and API keys
- **Product**: Product catalog, details, and CRUD
- **Cart**: User shopping carts
- **Order**: Order records and checkout
- **Discount**: Discount codes and logic
- **Inventory**: Stock management
- **Comment**: Product reviews/comments
- **Shop**: Shop or vendor information

## Testing
Test files are located in `src/tests/`. To run tests (if implemented):
```bash
npm test
```

## Dependencies
- express
- mongoose
- redis
- bcrypt
- dotenv
- jsonwebtoken
- lodash
- slugify
- helmet
- compression
- morgan

## License
[ISC](LICENSE)

---

For more details, see the `docs/` directory or contact the project maintainer.

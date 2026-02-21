<div dir="rtl" align="right">

# وب‌سرویس مدیریت کاربران با احراز هویت

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis)](https://redis.io)
[![JWT](https://img.shields.io/badge/JWT-auth-000000?logo=json-web-tokens)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

**English** | [فارسی](#fa-version)

---

<a id="en-version"></a>
# User Management API with Authentication

A robust RESTful API for user management built with Node.js, Express, MongoDB, and Redis. It features secure authentication (JWT + bcrypt), role-based access control (RBAC), token caching/blacklisting with Redis, and a clean layered architecture (Controller-Service). Ideal for projects needing a production-ready auth system.

## ✨ Features

- **Secure Registration & Login** – Passwords hashed with bcrypt before storage.
- **JWT + Redis** – Tokens cached and managed in Redis (blacklist support for logout/invalidation).
- **Role-Based Access Control (RBAC)** – Built-in `user` and `admin` roles with middleware protection.
- **Data Validation** – Incoming requests validated using `express-validator`.
- **Layered Architecture** – Separation of concerns: Routes, Controllers, Services, Models.
- **Global Error Handling** – Centralized error handler with consistent JSON responses.
- **Bilingual Support** – Code comments and documentation available in English and Persian.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Caching & Token Mgmt:** Redis
- **Authentication:** JWT, bcrypt
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate limiting (optional)

## 📁 Project Structure

```text
├── src/
│   ├── config/          # Database & Redis connections
│   ├── models/          # Mongoose models (User.js)
│   ├── services/        # Business logic, DB interactions
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, RBAC, validation, error handler
│   ├── routes/          # API route definitions
│   ├── utils/           # Helpers, constants, token utils
│   └── app.js           # App entry point
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md

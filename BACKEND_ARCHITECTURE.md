# Backend Architecture

## Overview
The backend of the MultiPlatformChatApp is built using Node.js with Express for the API layer and Socket.IO for real-time messaging. The backend is designed to handle user authentication, message encryption, and data storage, ensuring scalability and cross-platform compatibility.

## Technologies Used
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building the backend server.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Socket.IO**: A library that enables real-time, bidirectional, and event-based communication between the browser and the server.
- **SQLite**: A C-language library that provides a lightweight, disk-based database. It is used for storing user data and messages.
- **bcrypt**: A library for hashing passwords, ensuring secure storage of user credentials.
- **jsonwebtoken**: A library for generating and verifying JSON Web Tokens (JWT), used for user authentication.
- **Jest**: A JavaScript testing framework used for writing and running tests.
- **Supertest**: A library for testing Node.js HTTP servers, used in conjunction with Jest.

## Directory Structure
```
backend/
├── auth.js
├── auth.test.js
├── db.js
├── encryption.js
├── encryption.test.js
├── index.js
└── BACKEND_ARCHITECTURE.md
```

## Key Components

### Authentication
- **auth.js**: Handles user registration and login. Uses bcrypt for hashing passwords and jsonwebtoken for generating JWTs.
- **auth.test.js**: Contains tests for the authentication routes using Jest and Supertest.

### Encryption
- **encryption.js**: Provides functions for generating RSA key pairs, encrypting messages with a public key, and decrypting messages with a private key.
- **encryption.test.js**: Contains tests for the encryption functions using Jest.

### Database
- **db.js**: Sets up the SQLite database and defines the schema for storing user data, including username, hashed password, public key, and private key.

### Server
- **index.js**: The main entry point of the backend server. Sets up Express and Socket.IO, defines API routes, and starts the server on port 5000.

## Scalability and Cross-Platform Compatibility
- **Scalability**: The backend is designed to handle a growing number of users and messages by leveraging Node.js's non-blocking I/O and event-driven architecture. Socket.IO ensures efficient real-time communication, and SQLite provides a lightweight and efficient database solution.
- **Cross-Platform Compatibility**: The backend can run on any platform that supports Node.js, including Linux, Windows, and macOS. The use of standard web technologies (HTTP, WebSocket) ensures compatibility with various frontend clients, including web browsers and mobile applications.

## Testing
- **Jest and Supertest**: Used for writing and running tests to ensure the correctness of the authentication and encryption functionalities. Tests are located in `auth.test.js` and `encryption.test.js`.

## Future Enhancements
- **Load Balancing**: Implement load balancing to distribute incoming traffic across multiple server instances.
- **Database Optimization**: Explore more advanced database solutions (e.g., PostgreSQL) for handling larger datasets and more complex queries.
- **Security Enhancements**: Implement additional security measures, such as rate limiting, input validation, and monitoring for suspicious activities.

This documentation provides an overview of the backend architecture, highlighting the key components and technologies used. It ensures that the backend is scalable, secure, and compatible across different platforms.

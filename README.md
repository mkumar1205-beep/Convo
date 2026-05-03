# Convo

A simple real-time chat backend built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Socket.IO**.

## Features

- User signup and login with JWT authentication
- Password hashing using bcrypt
- Protected chat APIs
- Send, fetch, and delete messages
- Real-time message delivery with Socket.IO
- Minimal HTML test page for socket + API flow

## Project Structure

- `backend/server.js` – Express app, MongoDB connection, route mounting
- `backend/socket.js` – Socket.IO setup and in-memory online user tracking
- `backend/routes/authRoutes.js` – Auth routes (`/signup`, `/login`)
- `backend/routes/chatRoutes.js` – Message routes (`POST /`, `GET /:userId`, `DELETE /:id`)
- `backend/controller/authController.js` – Signup/login and JWT generation
- `backend/controller/chatController.js` – Message CRUD + realtime emit
- `backend/middleware/protect.js` – JWT auth middleware
- `backend/models/user.js` – User schema and password helpers
- `backend/models/chat.js` – Message schema
- `frontend/test.html` – Basic browser test client
- `frontend/app.js` – Simple socket client example

## Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/convo
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

3. Start the server:

   ```bash
   node backend/server.js
   ```

Server runs on `http://localhost:5000`.

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

Example signup body:

```json
{
  "username": "sampleuser",
  "email": "user@example.com",
  "password": "secret123"
}
```

### Messages (Protected)

Add header:

```http
Authorization: Bearer <token>
```

- `POST /api/messages` – Send a message
- `GET /api/messages/:userId` – Get conversation with a user
- `DELETE /api/messages/:id` – Delete a message (sender only)

## Realtime Events

Client emits:

- `join` with `userId`

Server emits:

- `newMessage` with message payload

## Quick Manual Test

1. Start backend.
2. Open `frontend/test.html` (for example with Live Server on `localhost:5500`).
3. Join with a user id in two browser tabs.
4. Send messages and verify `newMessage` alerts.

## Notes

- `onlineUsers` is stored in memory and resets on server restart.
- CORS is currently set for local testing origins in `backend/server.js`.

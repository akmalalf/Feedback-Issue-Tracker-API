# Feedback API

A backend API for collecting user feedback and issue tracking. Built with Node.js, Express, MongoDB, and Firebase Storage.

## Features

- User authentication (JWT-based)
- Submit feedback and bug reports
- Upload screenshots to Firebase Storage
- MongoDB for data storage
- Protected routes
- RESTful API

## Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Firebase Admin SDK (for file uploads)
- Multer (for handling multipart form-data)
- JWT Authentication

## Environment Variables

Create a `.env` file with the following variables:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/feedback-api
JWT_SECRET=your_secret_key
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
```
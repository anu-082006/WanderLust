# WanderLust

WanderLust is a full-stack travel listings marketplace built with Node.js, Express, EJS, and MongoDB. Users can sign up, log in, create listings, upload images, leave reviews, and browse travel stays with flash messaging and server-side validation.

## Features

- User authentication with Passport
- Create, edit, and delete listings
- Image uploads with Cloudinary and Multer
- Reviews for listings
- Flash messages and session handling with MongoDB-backed store
- Server-side validation with Joi
- Map support with MapTiler

## Tech Stack

- Node.js
- Express
- MongoDB and Mongoose
- EJS and ejs-mate
- Passport / Passport Local / passport-local-mongoose
- Multer and Cloudinary
- connect-session and connect-flash
- Joi

## Project Structure

- `app.js` - Express application entry point
- `controllers/` - Route handlers
- `models/` - Mongoose models
- `routes/` - Express routers
- `views/` - EJS templates
- `public/` - Static assets
- `utils/` - Helper utilities
- `middleware.js` - Authentication and validation middleware
- `schema.js` - Joi validation schemas

## Prerequisites

- Node.js
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account
- MapTiler API key

## Environment Variables

Create a `.env` file with the values your app expects:

```bash
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAPTILER_API_KEY=your_maptiler_api_key
```

## Installation

```bash
git clone https://github.com/anu-082006/WanderLust.git
cd WanderLust
npm install
```

## Running the App

```bash
node app.js
```

Then open:

```bash
http://localhost:3000
```

## Notes

- The app redirects `/` to `/listings`.
- The current server port is `3000`.
- The repository does not currently include a test script.

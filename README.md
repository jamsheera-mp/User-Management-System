# User Management System

A simple User Management System where users can upload their profile images, and admins have the ability to update, delete, and edit user details.

## Features

### User:

- Upload a profile image.
- View and update their own profile information.

### Admin:

- View, update, and delete user profiles.
- Edit user details such as name, email, and other information.

## Technologies Used

- **Frontend:** React, Redux
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **File Upload:** Multer, Cloudinary

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/user-management-system.git
   cd user-management-system
   ```

2. Install dependencies for both frontend and backend:

   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the backend directory with the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. Start the backend server:

   ```sh
   cd backend
   npm start
   ```

5. Start the frontend application:

   ```sh
   cd frontend
   npm run dev
   ```

## API Endpoints

### User Routes:

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user and get token
- `GET /api/users/profile` - Get user profile (requires authentication)
- `PUT /api/users/profile` - Update user profile (requires authentication)

### Admin Routes:

- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id` - Update user details (Admin only)
- `DELETE /api/admin/users/:id` - Delete a user (Admin only)

## File Upload

- Users can upload profile images using **Multer** for handling multipart/form-data.
- **Cloudinary** is used for storing images.




# ProConnect - Professional Networking Platform

A comprehensive LinkedIn-like professional networking and hiring platform built with the MERN stack (MongoDB, Express, React, Node.js) and modern technologies.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**: Secure JWT-based authentication
- **Professional Profiles**: Complete user profiles with experience, education, skills, and certifications
- **Connection Management**: Send, accept, and manage professional connections
- **News Feed**: Create posts, like, comment, and share content
- **Job Board**: Post jobs, search opportunities, and apply with cover letters
- **Real-time Messaging**: Chat with connections using Socket.IO
- **Notifications**: Real-time notifications for all activities
- **Company Pages**: Create and follow company profiles
- **Advanced Search**: Search for people, jobs, companies, and posts
- **Skills & Endorsements**: Add skills and receive endorsements from connections
- **Recommendations**: Give and receive professional recommendations

### Technical Features
- **Real-time Communication**: Socket.IO for instant messaging and notifications
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support on frontend
- **State Management**: Zustand for efficient state management
- **API Architecture**: RESTful API with proper error handling
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
cd C:\Users\hardi\CascadeProjects\professional-network
```

### 2. Install dependencies
```bash
npm run install-all
```

This will install dependencies for both backend and frontend.

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/professional-network
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 5. Run the application

#### Development Mode (runs both frontend and backend)
```bash
npm run dev
```

#### Run separately
```bash
# Backend (from backend directory)
cd backend
npm run dev

# Frontend (from frontend directory)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
professional-network/
├── backend/
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   ├── Connection.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── jobs.js
│   │   ├── connections.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   ├── companies.js
│   │   └── search.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── server.js         # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand stores
│   │   ├── lib/          # Utilities and API client
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/experience` - Add experience
- `POST /api/users/education` - Add education
- `POST /api/users/skills` - Add skill
- `POST /api/users/:userId/skills/:skillId/endorse` - Endorse skill

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get feed
- `GET /api/posts/:id` - Get post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Comment on post
- `POST /api/posts/:id/share` - Share post

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply to job
- `POST /api/jobs/:id/save` - Save/unsave job

### Connections
- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/:id/accept` - Accept request
- `PUT /api/connections/:id/reject` - Reject request
- `GET /api/connections/requests` - Get pending requests
- `GET /api/connections` - Get connections

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Companies
- `POST /api/companies` - Create company
- `GET /api/companies` - Get companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies/:id/follow` - Follow/unfollow company

### Search
- `GET /api/search?q=query&type=all` - Global search

## 🎨 Frontend Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Framer Motion** - Animations

## 🔧 Backend Technologies

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression
- **Rate Limiting** - API rate limiting

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Rate limiting on API endpoints
- Protected routes and middleware

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables
2. Update MongoDB connection string
3. Deploy backend code

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update API base URL

## 📝 Usage Guide

### Creating an Account
1. Navigate to the registration page
2. Fill in your details (first name, last name, email, password)
3. Click "Create Account"

### Building Your Profile
1. Go to your profile
2. Click "Edit Profile"
3. Add your headline, about, experience, education, and skills

### Connecting with Professionals
1. Go to the Network tab
2. Browse suggestions or search for people
3. Send connection requests
4. Accept incoming requests

### Finding Jobs
1. Navigate to the Jobs page
2. Use filters to search for relevant positions
3. Click on a job to view details
4. Apply with your cover letter

### Messaging
1. Go to Messages
2. Select a connection
3. Start chatting in real-time

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🐛 Known Issues & Future Enhancements

### Potential Enhancements:
- File upload functionality for resumes and profile pictures
- Email notifications
- Advanced analytics dashboard
- Video calls integration
- Groups and communities
- Events and webinars
- Premium features
- Mobile app (React Native)
- AI-powered job recommendations
- Resume builder
- Interview preparation tools

## 📞 Support

For issues and questions, please create an issue in the repository.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for professional networking.

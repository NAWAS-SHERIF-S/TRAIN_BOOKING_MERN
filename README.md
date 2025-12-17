# 🚂 Train Booking System - MERN Stack

A full-stack train booking application built with MongoDB, Express.js, React.js, and Node.js. Features real-time train tracking, seat selection, payment integration, and admin dashboard.

## ✨ Features

### User Features
- 🔐 **User Authentication** - Secure login/registration with JWT
- 🔍 **Train Search** - Search trains between stations with live status
- 🎫 **Seat Layout** - Visual seat selection for all train classes (SL, 3A, 2A, 1A, CC, 2S)
- 📍 **Live Train Tracking** - Real-time train location and delay information
- 💳 **Payment Gateway** - Multiple payment options (Card, UPI, Net Banking, Wallet)
- 🎟️ **Ticket Generation** - Downloadable ticket receipts with PNR
- 📊 **PNR Status** - Check booking status using PNR number
- 📜 **Booking History** - View all past and current bookings
- 🚉 **Station Autocomplete** - 200+ Indian Railway stations with codes

### Admin Features
- 📈 **Dashboard** - Overview of bookings, revenue, and statistics
- 🚆 **Train Management** - Add, edit, delete trains
- 🔴 **Live Status Management** - Update real-time train status
- 📋 **Booking Management** - View and manage all bookings

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/NAWAS-SHERIF-S/TRAIN_BOOKING_MERN.git
cd TRAIN_BOOKING_MERN
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update .env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🗄️ Database Setup

### Initialize Database with Sample Data
```bash
cd backend

# Create users (admin and regular user)
node createUsers.js

# Add train data with proper station codes
node resetTrains.js
```

### Default Credentials
**Admin Account:**
- Email: `admin@trainbooking.com`
- Password: `admin123`

**User Account:**
- Email: `john@example.com`
- Password: `password123`

## 📱 Application Structure

```
train_booking/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── context/     # React context
    │   ├── hooks/       # Custom hooks
    │   └── utils/       # Helper functions
    └── public/          # Static assets
```

## 🎯 Key Features Explained

### Train Search
- Search trains between any two stations
- Filter by quota (General, Tatkal, Ladies, Sr. Citizen)
- Sort by recommended, fastest, or cheapest
- View class-wise pricing and availability
- Live train status with current location

### Seat Layout
- Visual representation of all train classes
- Color-coded seats (Available, Selected, Booked)
- Interactive seat selection
- Class-specific layouts (Sleeper, AC, Chair Car)

### Booking Flow
1. Search trains
2. Select class and view seat layout
3. Add passenger details (name, age, gender, berth preference)
4. Review booking summary
5. Select payment method
6. Complete payment
7. Download ticket with PNR

### Payment Integration
- Multiple payment methods
- Secure payment processing
- Automatic ticket generation
- Email confirmation (simulated)

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control (Admin/User)
- Input validation
- Error handling middleware

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Trains
- `GET /api/trains` - Get all trains
- `GET /api/trains/search` - Search trains
- `GET /api/trains/:id` - Get train by ID
- `POST /api/trains` - Create train (Admin)
- `PUT /api/trains/:id` - Update train (Admin)
- `DELETE /api/trains/:id` - Delete train (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/pnr/:pnr` - Get booking by PNR
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Live Status
- `GET /api/status/:trainNumber` - Get live train status
- `PUT /api/status/:trainNumber` - Update status (Admin)

## 🎨 UI/UX Features
- Responsive design for all devices
- Smooth animations with Framer Motion
- Loading states and skeletons
- Error handling with user-friendly messages
- Toast notifications
- Modal dialogs
- Dropdown menus with search

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Create account on Render/Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Create account on Vercel/Netlify
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License.

## 👨‍💻 Author
**Nawas Sherif S**
- GitHub: [@NAWAS-SHERIF-S](https://github.com/NAWAS-SHERIF-S)

## 🙏 Acknowledgments
- Indian Railways for station data
- IRCTC for UI/UX inspiration
- MongoDB Atlas for database hosting
- Tailwind CSS for styling framework

## 📞 Support
For support, email your-email@example.com or create an issue in the repository.

---

⭐ Star this repository if you found it helpful!

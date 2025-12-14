# TripWise - AI Travel Companion

An AI-powered travel planning application with separate frontend and backend architectures.

## 📁 Project Structure

```
tripwise/
│
├── tripwise-frontend/        ← Vite + React (Frontend)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── README.md
│
├── tripwise-backend/         ← Java Spring Boot (Backend)
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── pom.xml
│   ├── .env
│   └── README.md
│
└── README.md                 ← This file
```

## 🚀 Quick Start

### Frontend (Port 3000)

```bash
cd tripwise-frontend
bun install
bun dev
```

### Backend (Port 8080)

```bash
cd tripwise-backend
mvn clean package
java -jar target/tripwise-backend-1.0.0.jar
```

Or use the provided run script:
```bash
cd tripwise-backend
./run.sh
```

## 🎯 Architecture Overview

### Frontend
- **Technology**: React 18 + Vite
- **Port**: 3000
- **Purpose**: UI, animations, routing, displaying data
- **Features**:
  - AI-powered trip planning interface
  - Voice input support
  - Multi-language support (10+ languages)
  - Beautiful glassmorphism UI with animations
  - Responsive design

### Backend
- **Technology**: Java 21 + Spring Boot 3.3.5
- **Port**: 8080
- **Purpose**: Business logic, database operations, AI integration, APIs
- **Features**:
  - MongoDB integration
  - JWT authentication
  - RESTful APIs (auth, trips, bookings, users)
  - AI integration (ChatGPT & Gemini)
  - Google Maps integration (planned)
  - Mocked booking and payment APIs

## 🔧 Prerequisites

- **Frontend**: Node.js 18+ or Bun
- **Backend**: Java 21, Maven 3.6+
- **Database**: MongoDB running on localhost:27017

## 📝 Environment Variables

### Frontend (.env)
```
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### Backend (.env)
```
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
MONGODB_URI=mongodb://localhost:27017/tripwise
```

## 🌐 API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create trip
- `GET /api/trips/{id}` - Get trip by ID

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking

### Users
- `GET /api/users/{id}` - Get user by ID

## 🗄️ Database

**MongoDB** (`localhost:27017`)
- Database: `tripwise`
- Collections: `users`, `trips`, `bookings`

## 📦 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion + GSAP
- React Router DOM
- Lucide React (icons)
- Web Speech API (voice input)

### Backend
- Spring Boot 3.3.5
- Spring Data MongoDB
- Spring Security + JWT
- Java 21
- Maven
- MongoDB Driver

## 🎨 Key Features

- ✅ AI-powered trip planning (Gemini/ChatGPT)
- ✅ Voice input for all form fields
- ✅ Multi-language support
- ✅ Trip customization (type, travelers, budget, mode)
- ✅ Beautiful animations and glassmorphism UI
- ✅ JWT authentication
- ✅ MongoDB database
- ✅ RESTful API architecture
- 🚧 Google Maps integration (planned)
- 🚧 Payment gateway integration (planned)

## 📚 Documentation

- [Frontend README](tripwise-frontend/README.md)
- [Backend Architecture](BACKEND_ARCHITECTURE.md)
- [Feature Summary](FEATURE_SUMMARY.md)
- [Updates Summary](UPDATES_SUMMARY.md)

## 🔄 Development Workflow

1. **Start MongoDB**:
   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   cd tripwise-backend
   ./run.sh
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   cd tripwise-frontend
   bun dev
   ```

4. Access:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

## 🚧 Current Status

- ✅ Frontend and backend separated into independent projects
- ✅ Both projects running on different ports
- ✅ MongoDB integration complete
- ✅ JWT authentication configured
- ✅ RESTful APIs implemented
- ⏳ Integration between frontend and backend pending

## 📄 License

MIT License

---

Made with ❤️ using React, Spring Boot, MongoDB, and AI

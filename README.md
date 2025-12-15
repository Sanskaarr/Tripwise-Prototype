# TripWise - AI Travel Companion

An intelligent travel planning application with separate frontend and backend architecture.

## Project Structure

```
tripwise/
│
├── tripwise-frontend/        ← Vite + React (Frontend)
│   ├── src/
│   │   ├── components/       → UI components
│   │   ├── contexts/         → React contexts
│   │   ├── hooks/            → Custom hooks
│   │   ├── pages/            → Page components
│   │   ├── services/         → API service layer
│   │   ├── App.jsx           → Main app component
│   │   ├── main.jsx          → Entry point
│   │   └── index.css         → Global styles
│   ├── public/               → Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── tripwise-backend/         ← Java Spring Boot (Backend)
│   ├── src/main/java/com/tripwise/
│   │   ├── config/           → Configuration classes
│   │   ├── controller/       → REST API endpoints
│   │   ├── dto/              → Data transfer objects
│   │   ├── model/            → MongoDB models
│   │   ├── repository/       → MongoDB repositories
│   │   ├── security/         → JWT & security
│   │   ├── service/          → Business logic
│   │   └── TripwiseApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── README.md
│
└── README.md
```

## Architecture

### Frontend (Port 3000)
- **Framework**: Vite + React 18
- **Styling**: TailwindCSS with custom animations
- **Animation**: Framer Motion + GSAP
- **Routing**: React Router v6
- **Features**:
  - AI trip planning with voice input
  - Multilingual support (10+ languages)
  - Trip customization and booking flow
  - Interactive dashboard
  - Beautiful UI with glassmorphism and animations

### Backend (Port 8080)
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **Database**: MongoDB
- **Security**: JWT Authentication
- **Features**:
  - User authentication (login/registration)
  - Trip management APIs
  - Booking system
  - AI integration (ChatGPT & Gemini)
  - Google Maps integration
  - User recognition (first-time/returning)

## Getting Started

### Prerequisites
- Node.js 18+ and Bun/npm
- Java 21
- Maven 3.8+
- MongoDB running on localhost:27017

### Frontend Setup

```bash
cd tripwise-frontend
bun install
bun run dev
```

Frontend runs on **http://localhost:3000**

### Backend Setup

```bash
cd tripwise-backend
mvn clean install
mvn spring-boot:run
```

Backend runs on **http://localhost:8080**

## Environment Variables

### Frontend (.env)
```env
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### Backend (application.properties)
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/tripwise
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get trip by ID
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{userId}` - Get user bookings
- `GET /api/bookings/{id}` - Get booking by ID

## Technologies

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- GSAP
- Axios
- React Router
- Lucide Icons

### Backend
- Spring Boot 3.3.5
- Spring Data MongoDB
- Spring Security + JWT
- Lombok
- Maven

## Features

✅ **Completed:**
- Separate frontend and backend projects
- MongoDB integration
- JWT authentication
- REST API endpoints
- React UI with animations
- AI integration (Gemini)
- Voice input support
- Multilingual interface
- Trip planning and booking flow

🔄 **Note:**
At this stage, frontend and backend are **not connected**. Frontend uses mock data. Integration will be done explicitly when required.

## License

MIT License

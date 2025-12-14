# TripWise Backend

Java Spring Boot backend for the TripWise AI Travel Companion.

## 🚀 Quick Start

### Option 1: Using Maven
```bash
mvn clean package
java -jar target/tripwise-backend-1.0.0.jar
```

### Option 2: Using run script
```bash
./run.sh
```

Backend runs on: http://localhost:8080

## 🎯 Features

- **MongoDB Integration**: Spring Data MongoDB for persistence
- **JWT Authentication**: Secure user authentication
- **RESTful APIs**: Auth, Trips, Bookings, Users
- **AI Integration**: Ready for ChatGPT & Gemini APIs
- **Google Maps Integration**: Planned for travel data
- **CORS Enabled**: Configured for frontend communication

## 🔧 Tech Stack

- Java 21
- Spring Boot 3.3.5
- Spring Data MongoDB
- Spring Security + JWT
- Maven
- MongoDB Driver

## 📝 Environment Variables

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
MONGODB_URI=mongodb://localhost:27017/tripwise
```

## 🗄️ Database

**MongoDB** must be running on `localhost:27017`

Database name: `tripwise`

Collections:
- `users` - User accounts
- `trips` - Trip records
- `bookings` - Booking records

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get trip by ID

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking

### Users
- `GET /api/users/{id}` - Get user by ID

## 📁 Project Structure

```
src/main/java/com/tripwise/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/             # Data transfer objects
├── model/           # Domain models
├── repository/      # MongoDB repositories
├── security/        # Security & JWT
└── service/         # Business logic
```

## 🔒 Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configured for localhost:3000
- Public endpoints: `/api/auth/**`

## 📦 Build

```bash
mvn clean package
```

Generated JAR: `target/tripwise-backend-1.0.0.jar`

## 📄 License

MIT License

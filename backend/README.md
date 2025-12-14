# TripWise Backend - Java Spring Boot

## Architecture
This backend implements a strict backend-first architecture where:
- **All AI intelligence resides in the backend** (ChatGPT & Gemini)
- **User recognition** (first-time vs returning) is handled by backend
- **All travel suggestions** are dynamically generated using AI + Google Maps
- Frontend only sends: user_id, text, and language preference

## Tech Stack
- Java 21
- Spring Boot 3.2.1
- Spring Security + JWT Authentication
- MySQL Database
- OpenAI API (ChatGPT)
- Google Gemini API
- Google Maps API (optional, with mock fallback)

## Prerequisites
- Java 21+
- Maven 3.9+
- MySQL 8.0+ (or use H2 for development)

## Setup

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE tripwise;
```

Or update `application.properties` to use H2 (in-memory):
```properties
spring.datasource.url=jdbc:h2:mem:tripwise
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

### 2. Environment Variables
Create `.env` file in backend directory or set system environment variables:
```
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
GOOGLE_MAPS_API_KEY=your_google_maps_key (optional)
```

### 3. Install Dependencies
```bash
cd backend
mvn clean install
```

### 4. Run Application
```bash
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (returns JWT + user recognition)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/complete-profile` - Complete first-time user profile

### Chat (AI-Powered)
- `POST /api/chat` - Send message (backend calls ChatGPT)
  - Body: `{ "text": "string", "language": "string" }`
  - All AI processing happens in backend

### Local Guide (AI + Google Maps)
- `POST /api/local-guide` - Get AI-generated local guide
  - Body: `{ "location": "string", "language": "string" }`
  - Backend merges Gemini AI + Google Maps data
- `GET /api/local-guide/places?location=X&type=Y` - Search places

## Key Features

### User Recognition
Backend automatically detects:
- **First-time users**: `isFirstTime: true` in response → Frontend requests phone & preferences
- **Returning users**: `isFirstTime: false` → Personalized welcome with stored preferences

### AI Integration
- ChatGPT provides conversational travel advice
- Gemini generates comprehensive local guides
- Google Maps provides factual place data
- Backend enriches AI responses with user preferences

### Security
- JWT-based authentication
- Stateless sessions
- Password encryption (BCrypt)
- CORS configured for frontend

## Database Schema

### Users Table
- id (PK)
- email (unique)
- password (encrypted)
- phoneNumber
- preferredLanguage
- travelStyle
- dietaryPreferences
- interests
- isFirstTime (boolean)
- createdAt
- lastLoginAt

## Testing
```bash
# Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test chat (with JWT)
curl -X POST http://localhost:8080/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"What should I do in Paris?","language":"English"}'
```

## Development Notes
- Mock APIs are used when Google Maps API key is not provided
- All AI calls include error handling
- User preferences automatically enhance AI prompts
- Database auto-creates tables on first run (ddl-auto=update)

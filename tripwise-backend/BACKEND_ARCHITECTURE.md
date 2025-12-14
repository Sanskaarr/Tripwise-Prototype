# TripWise - Backend Architecture Documentation

## Overview
Complete Java Spring Boot backend implementing strict backend-first architecture where **ALL intelligence resides in the backend**.

## Tech Stack
- **Java 21** with Spring Boot 3.2.1
- **Spring Security** + JWT authentication
- **Spring Data JPA** + MySQL
- **OpenAI API** (ChatGPT 3.5-turbo)
- **Google Gemini API** (gemini-pro)
- **Google Maps API** (with mock fallback)

## Architecture Principles

### 1. Backend-First Intelligence
- ✅ **All AI calls happen in backend** (ChatGPT, Gemini)
- ✅ **User recognition logic in backend** (first-time vs returning)
- ✅ **Dynamic content generation** (no static local data)
- ✅ **Frontend is dumb client** (only sends: user_id, text, language)

### 2. User Recognition Flow
```
Login → Backend checks isFirstTime flag
  ├─ First-time: Returns isFirstTime=true, message="Complete profile"
  │   └─ Frontend shows: phone number + preferences form
  └─ Returning: Returns isFirstTime=false, message="Welcome back [name]!"
      └─ Frontend shows: personalized dashboard
```

### 3. AI Integration Architecture
```
Frontend Request → Backend Controller → Services Layer
                                      ├─ OpenAI (chat responses)
                                      ├─ Gemini (local guides)
                                      └─ Google Maps (place data)
                                      ↓
                                   Merge & Enhance
                                      ↓
                                   Send to Frontend
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - Authenticate user, detect first-time vs returning
- `POST /register` - Create new user account
- `POST /complete-profile` - Complete first-time user profile

**Response includes:**
- JWT token
- `isFirstTime` boolean
- Personalized message
- User preferences (if returning user)

### Chat (`/api/chat`)
- `POST /` - Send chat message
  - **Input:** `{ text, language }`
  - **Backend does:** Fetch user preferences → Enhance prompt → Call ChatGPT → Return response
  - **No AI logic in frontend**

### Local Guide (`/api/local-guide`)
- `POST /` - Get AI-generated local guide
  - **Input:** `{ location, language }`
  - **Backend does:** 
    1. Call Gemini API for comprehensive guide
    2. Call Google Maps for factual place data
    3. Merge AI context + real data
    4. Return structured response
  - **Frontend only renders received data**

- `GET /places?location=X&type=Y` - Search specific places

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    preferred_language VARCHAR(50),
    travel_style VARCHAR(100),
    dietary_preferences VARCHAR(255),
    interests TEXT,
    is_first_time BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);
```

## Security Architecture
- **JWT-based stateless authentication**
- **BCrypt password hashing**
- **Request filtering** via `JwtAuthenticationFilter`
- **CORS configured** for frontend origin
- **Public endpoints:** `/api/auth/**`
- **Protected endpoints:** All others (require JWT)

## Key Services

### 1. `AuthService`
- Login with user recognition
- First-time user detection
- Profile completion
- Personalized welcome messages

### 2. `OpenAIService`
- ChatGPT integration
- Contextual travel advice
- User preference enhancement
- Multilingual support

### 3. `GeminiService`
- Comprehensive local guide generation
- Structured travel information
- Cultural context
- Safety tips

### 4. `GoogleMapsService`
- Real place data via Google Maps API
- Mock fallback when API key missing
- Place search functionality
- Rating and location data

## Environment Configuration

### Required
```properties
VITE_OPENAI_API_KEY=sk-...
VITE_GEMINI_API_KEY=AIza...
```

### Optional
```properties
GOOGLE_MAPS_API_KEY=AIza...  # Falls back to mock data
```

### Database
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tripwise
spring.datasource.username=root
spring.datasource.password=
```

## Running the Backend

### Quick Start
```bash
cd backend
./run.sh
```

### Manual Start
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: **http://localhost:8080**

## Testing

### Test Authentication
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Chat (requires JWT)
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"What should I do in Paris?","language":"English"}'
```

### Test Local Guide
```bash
curl -X POST http://localhost:8080/api/local-guide \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location":"Tokyo","language":"English"}'
```

## Project Structure
```
backend/
├── pom.xml                          # Maven dependencies
├── run.sh                           # Quick start script
├── README.md                        # Backend documentation
└── src/main/java/com/tripwise/
    ├── TripWiseApplication.java     # Main Spring Boot app
    ├── config/
    │   └── SecurityConfig.java      # Security + CORS config
    ├── controller/
    │   ├── AuthController.java      # Auth endpoints
    │   ├── ChatController.java      # Chat endpoints
    │   └── LocalGuideController.java # Local guide endpoints
    ├── dto/
    │   ├── LoginRequest.java
    │   ├── RegisterRequest.java
    │   ├── AuthResponse.java
    │   ├── ChatRequest.java
    │   └── LocalGuideRequest.java
    ├── model/
    │   └── User.java                # User entity
    ├── repository/
    │   └── UserRepository.java      # User data access
    ├── security/
    │   ├── JwtUtil.java             # JWT token management
    │   └── JwtAuthenticationFilter.java
    └── service/
        ├── AuthService.java         # Authentication logic
        ├── OpenAIService.java       # ChatGPT integration
        ├── GeminiService.java       # Gemini integration
        └── GoogleMapsService.java   # Google Maps integration
```

## Design Decisions

### Why Backend-First?
1. **Security:** API keys never exposed to frontend
2. **Intelligence:** Complex AI logic centralized
3. **Flexibility:** Easy to swap AI models
4. **Performance:** Single source of truth
5. **Testing:** Easier to test backend logic

### Why Multiple AI Models?
- **ChatGPT:** Best for conversational responses
- **Gemini:** Comprehensive structured information
- **Google Maps:** Factual, real-time place data

### Why User Recognition?
- Better UX (no repeated onboarding)
- Personalized responses
- Preference persistence
- Smarter AI prompts

## Development Notes
- All tables auto-created on first run
- Mock APIs used when Google Maps key missing
- User preferences enhance all AI responses
- JWT tokens expire after 24 hours
- Password security via BCrypt
- CORS configured for localhost:3000 and localhost:5173

## Future Enhancements
- [ ] Add MongoDB support option
- [ ] Implement booking APIs
- [ ] Add payment integration (mock UPI/QR)
- [ ] Conversation history storage
- [ ] Multi-language support expansion
- [ ] Advanced travel recommendation engine

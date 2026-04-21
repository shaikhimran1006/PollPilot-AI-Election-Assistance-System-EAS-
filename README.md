# PollPilot AI Election Navigator Assistant

## High-Level Architecture

- **Frontend (React + Vite)**: Accessible UI, multilingual support, responsive layout, real-time updates.
- **Backend (Spring Boot)**: REST APIs, JWT auth, role-based access, validation, caching.
- **Google Services**:
  - **Firebase Authentication**: Secure login and social auth.
  - **Firestore/Realtime DB**: Store user progress and reminders at scale.
  - **Google Maps API**: Polling booth locator.
  - **Dialogflow**: AI chatbot and intent handling.
  - **Firebase Cloud Messaging**: Timeline reminders and alerts.
  - **Google Translate**: Multilingual support.

### Textual Architecture Diagram

Client (React) -> API Gateway (Spring Boot) -> Services (Journey, Timeline, Documents, Chat, Locator)

- Auth: Firebase Auth -> Backend Token Exchange -> JWT
- Data: Postgres (relational core) + Firestore (user progress)
- AI: Dialogflow (chat) + Custom NLP (fake news check)
- Notifications: FCM -> User Devices

## Tech Stack Justification

- **Spring Boot 3 + Java 17**: Production stability, security, and scalability.
- **React + Vite**: Fast builds and modern UI.
- **PostgreSQL**: Durable relational storage.
- **Firebase**: Secure auth + realtime data + messaging.
- **Dialogflow**: Intent-based NLP for elections.
- **Google Maps**: Accurate geospatial discovery.

## Database Schema (Core)

- users(id, email, password_hash, email_verified, created_at)
- user_roles(user_id, role)
- voter_profiles(id, user_id, age, location, first_time_voter, preferred_language)
- journey_steps(id, user_id, title, description, status, step_order)
- timeline_events(id, user_id, title, description, event_time, category)
- document_checklist(id, user_id, document_name, status)
- polling_locations(id, user_id, name, address, latitude, longitude)
- chat_sessions(id, user_id, last_intent)
- notification_preferences(id, user_id, fcm_token, reminders_enabled)
- fake_news_checks(id, user_id, content, verdict, confidence_score)

## API Design

### Auth

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/firebase

### Journey

- GET /api/journey
- PATCH /api/journey

### Timeline

- GET /api/timeline
- POST /api/timeline

### Documents

- GET /api/documents
- PATCH /api/documents

### Polling Locator

- POST /api/polling/search

### Chatbot

- POST /api/chat

### Translate

- POST /api/translate

### Notifications

- POST /api/notifications/preferences

### Fake News Detection

- POST /api/news/check

### Admin

- GET /api/admin/users

## Folder Structure

```
PollPilot-AI-Election-Assistance-System-EAS-
  backend/
    src/main/java/com/pollpilot/eas/
      config/
      controller/
      dto/
      exception/
      model/
      repository/
      service/
    src/main/resources/
  frontend/
    src/components/
    src/pages/
    src/services/
    src/i18n/
```

## Security Checklist

- JWT authentication + role-based access
- Input validation with Jakarta Validation
- CSRF disabled for stateless APIs
- XSS protection via sanitization and escaping on frontend
- CORS restricted to allowed origins

## Performance Optimization

- API caching with Caffeine for polling and translations
- Debounced search inputs on locator UI
- Lazy route loading (add React.lazy when scaling)
- Minimize re-renders via isolated components
- Efficient DB queries with user-scoped indexes

## Accessibility

- Keyboard-first navigation and visible focus states
- Screen reader support via ARIA labels and landmarks
- Contrast-checked palette and scalable typography
- Multilingual UI via i18next + Google Translate

## User Flow

1. Sign in (Firebase Auth) and profile onboarding
2. Personalized journey steps created for voter type
3. Timeline reminders with FCM notifications
4. Document checklist and validation
5. Polling locator with Google Maps
6. Chatbot + fake news detection for trusted guidance

## Testing Strategy

- JUnit tests for core services
- API tests via Postman collections
- React component tests (Vitest)
- Edge cases: invalid inputs, empty states, missing tokens

## Deployment

- Backend: `mvn spring-boot:run` (containerize with Docker for prod)
- Frontend: `npm run build` and host on Firebase Hosting or CDN

## Google Services Integration Steps

1. Create Firebase project, enable Email/Google sign-in.
2. Generate Firebase Admin service account JSON and set `FIREBASE_SERVICE_ACCOUNT`.
3. Enable Maps, Dialogflow, and Translate APIs in Google Cloud Console.
4. Add API keys to backend/frontend `.env` files.
5. Configure FCM for notifications and store tokens via `/api/notifications/preferences`.

## Postman Examples

- Auth: POST `/api/auth/login` with `{ "email": "user@x.com", "password": "Password123" }`
- Chat: POST `/api/chat` with `{ "message": "Where is my polling booth?" }`
- Locator: POST `/api/polling/search` with `{ "address": "123 Main St" }`

## Bonus Features

- Fake news detection (server-side service)
- Voice-ready chatbot integration (UI can be extended with Web Speech API)

# WanderNote Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2025-12-08
**Status:** Draft - Ready for Epic/Story Development
**Project Brief:** [docs/brief.md](./brief.md)

---

## Goals and Background Context

### Goals

- **Deliver unified travel experience:** Provide all-in-one solution for planning, navigation, documentation, and budget tracking that eliminates tool fragmentation
- **Enable real-time documentation:** Allow travelers to capture experiences authentically during trips through multimedia (text, photos, drawings, voice)
- **Support small group coordination:** Facilitate seamless collaboration for 2-4 person groups with shared planning, documentation, and expense splitting
- **Create lasting travel memories:** Enable travelers to export beautifully organized trip documentation as permanent keepsakes
- **Launch viable MVP in 6-9 months:** Deliver focused feature set that proves "all-in-one" value proposition to target market
- **Establish foundation for sustainable product:** Build scalable architecture and engaged user base for Phase 2 monetization

### Background Context

Travelers currently juggle 4-6 disconnected apps for trip planning, navigation, documentation, and expense tracking. This fragmentation creates friction, scattered data, and lost memories. WanderNote addresses this by unifying essential travel functionality into a single, purpose-built mobile app designed for solo travelers, couples, and small friend groups (2-4 people) planning themed city/village trips.

Unlike logistics-focused planners (TripIt, Google Trips) or retrospective journaling apps (Day One, Journey), WanderNote integrates planning with real-time creative documentation. Users can define trip purposes (adventure, culture, food), organize itineraries with map reference, capture experiences through rich multimedia, track budgets with automatic splitting, and export complete trip stories as keepsakes—all in one private, mobile-first application.

The MVP focuses on two validated priorities: (1) **Documentation depth** with text, photos, drawings, and voice memos, and (2) **Budget tracking** with currency conversion and expense splitting. By solving the fragmentation problem and enabling authentic in-the-moment storytelling, WanderNote creates a new category: the "travel companion app" that travels with you from planning through documentation.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-12-08 | 1.0 | Initial PRD creation from approved Project Brief | Sarah (PO) |

---

## Requirements

### Functional Requirements

**FR1: Trip Management**
- FR1.1: Users can create new trips with title, destination (city/village), start date, end date, and custom theme/purpose
- FR1.2: Users can edit trip details at any time
- FR1.3: Users can delete trips and all associated data
- FR1.4: Users can view list of all their trips (past, current, upcoming)
- FR1.5: Users can mark trips as "completed" to archive them
- FR1.6: Users can set trip privacy (private, shared with specific members)

**FR2: Itinerary Planning**
- FR2.1: Users can create daily itineraries within a trip
- FR2.2: Users can add events to specific days with title, time, location, and notes
- FR2.3: Users can reorder events within a day (drag-and-drop or up/down)
- FR2.4: Users can edit or delete events
- FR2.5: Users can copy events to other days
- FR2.6: Users can view weather forecast for trip dates to inform planning

**FR3: Map Integration**
- FR3.1: Users can view all trip locations on an integrated map (Google Maps or Mapbox)
- FR3.2: Users can add location pins to events by search or map tap
- FR3.3: Users can view route visualization between consecutive events
- FR3.4: Users can save favorite locations for future reference
- FR3.5: Users can navigate to event locations using device native maps app
- FR3.6: Map displays current location when user grants location permission

**FR4: Documentation - Rich Text Notes**
- FR4.1: Users can create rich text notes with formatting (bold, italic, headings, lists)
- FR4.2: Users can associate notes with specific days or entire trip
- FR4.3: Users can edit and delete notes
- FR4.4: Notes support long-form writing (essays, articles, reflections)
- FR4.5: Users can search within notes by keyword

**FR5: Documentation - Photos**
- FR5.1: Users can upload photos from device gallery or take new photos in-app
- FR5.2: Users can add captions and descriptions to photos
- FR5.3: Users can organize photos by day or trip-level albums
- FR5.4: Photos are automatically compressed for efficient storage
- FR5.5: Users can view photos in full-screen gallery mode
- FR5.6: Users can delete photos from trip documentation
- FR5.7: Photos display with timestamp and location metadata when available

**FR6: Documentation - Drawings**
- FR6.1: Users can create simple drawings/sketches using basic drawing tools
- FR6.2: Drawing tools include: pen, eraser, color picker, stroke width selection
- FR6.3: Users can annotate existing photos with drawings
- FR6.4: Drawings can be saved as standalone documentation or overlays
- FR6.5: Users can edit or delete drawings

**FR7: Documentation - Voice Memos**
- FR7.1: Users can record audio voice memos within the app
- FR7.2: Voice memos can be associated with specific days or trip-level
- FR7.3: Users can playback voice memos with standard audio controls (play, pause, seek)
- FR7.4: Voice memos display duration and timestamp
- FR7.5: Users can delete voice memos
- FR7.6: Audio files are compressed for efficient storage (MVP: no transcription)

**FR8: Documentation Export**
- FR8.1: Users can export completed trips as PDF documents
- FR8.2: Exported PDF includes trip metadata, itinerary, notes, photos, and basic formatting
- FR8.3: Users can optionally export as Markdown format
- FR8.4: Export includes trip title, dates, theme, all documentation in chronological order
- FR8.5: Users can choose to include/exclude specific content types in export
- FR8.6: Exported files can be shared via device native share sheet

**FR9: Budget Management**
- FR9.1: Users can set overall trip budget in any major currency
- FR9.2: Users can manually add expenses with amount, currency, category, description, and date
- FR9.3: Expense categories include: Food, Transport, Lodging, Activities, Shopping, Other
- FR9.4: Users can edit or delete expenses
- FR9.5: System displays budget vs. actual spending with visual progress indicator
- FR9.6: Users can view expense breakdown by category
- FR9.7: Users can view daily spending trends

**FR10: Currency Conversion**
- FR10.1: System automatically converts expenses to trip budget currency using real-time exchange rates
- FR10.2: Users can view original currency and converted amount for each expense
- FR10.3: Exchange rates are fetched daily and cached for offline use
- FR10.4: Users can manually refresh exchange rates when online

**FR11: Expense Splitting (Group Trips)**
- FR11.1: Users can mark expenses as "split" and select which group members to split with
- FR11.2: System calculates equal splits by default (divide by number of people)
- FR11.3: Users can view "who owes whom" summary for entire trip
- FR11.4: Users can view individual member balances (amount owed or owed to them)
- FR11.5: Users can mark debts as "settled" when paid
- FR11.6: System tracks split history for transparency

**FR12: Group Coordination**
- FR12.1: Trip creators can invite members by email or share link (maximum 4 total members including creator)
- FR12.2: Invited members receive invitation notification and can accept/decline
- FR12.3: All members can view shared trip details, itinerary, and map
- FR12.4: All members can add documentation (notes, photos, voice memos, drawings)
- FR12.5: All members can add expenses and participate in splitting
- FR12.6: Trip creator can remove members from trip
- FR12.7: Members can leave trip voluntarily
- FR12.8: All changes sync in real-time when members are online

**FR13: User Authentication**
- FR13.1: Users can register with email and password
- FR13.2: Users can log in with email and password
- FR13.3: Users can reset forgotten passwords via email
- FR13.4: Users remain logged in until explicit logout
- FR13.5: (Optional) Users can sign in with Google or Apple accounts

**FR14: Offline Functionality**
- FR14.1: Users can view previously loaded trip data when offline (read-only cached content)
- FR14.2: Offline viewing includes trip details, itinerary, notes, cached photos, and expense summaries
- FR14.3: Map displays last-loaded map tiles when offline
- FR14.4: System indicates offline status clearly in UI
- FR14.5: Actions requiring network (new trips, invites, real-time sync) are disabled with clear messaging when offline
- FR14.6: Cached exchange rates remain available offline (with timestamp showing last update)

**FR15: User Profile & Settings**
- FR15.1: Users can view and edit profile information (name, email, profile photo)
- FR15.2: Users can change password
- FR15.3: Users can set default currency preference
- FR15.4: Users can manage notification preferences
- FR15.5: Users can log out
- FR15.6: Users can delete account and all associated data (GDPR compliance)

---

### Non-Functional Requirements

**NFR1: Performance**
- App launch time must be under 3 seconds on mid-range smartphones
- Screen transitions must complete within 300ms
- Photo upload must complete within 5 seconds for 5MB images
- Offline cached content must load instantly (< 500ms)
- Map rendering must be smooth (60fps pan/zoom on supported devices)

**NFR2: Scalability**
- Backend must support 10,000 concurrent users without degradation
- Database queries must complete within 200ms for 95th percentile
- System must handle 1M photos stored across all users
- API endpoints must support 100 requests/second per instance

**NFR3: Reliability**
- App must have 99% uptime during peak travel seasons
- Data sync must retry failed operations automatically with exponential backoff
- Photo uploads must be resumable if interrupted
- No data loss for user-created content (trips, notes, expenses)
- Graceful degradation when third-party services fail (maps, weather, currency APIs)

**NFR4: Security**
- All API communication must use HTTPS (TLS 1.2+)
- User passwords must be hashed with bcrypt (minimum 12 rounds)
- Authentication tokens (JWT) must expire after 30 days
- File uploads must be scanned for malware
- API rate limiting must prevent abuse (100 requests/minute per user)
- User data must be encrypted at rest in database

**NFR5: Privacy & Compliance**
- User data must not be shared with third parties without explicit consent
- Users must be able to export all their data (GDPR Article 20)
- Users must be able to delete all their data (GDPR Article 17)
- Privacy policy must clearly explain data collection and usage
- No tracking or analytics without user consent
- All user content is private by default (no public discovery)

**NFR6: Usability**
- App must be usable without tutorials for basic flows (create trip, add note, log expense)
- Error messages must be clear and actionable
- All user actions must have immediate visual feedback
- Undo functionality must be available for destructive actions
- App must be accessible to users with basic smartphone literacy

**NFR7: Maintainability**
- Code must follow established style guides (TypeScript/Java)
- All critical business logic must have unit tests (>80% coverage)
- API must be versioned to support backward compatibility
- Database migrations must be reversible
- Logging must capture errors with sufficient context for debugging

**NFR8: Compatibility**
- iOS 14+ and Android 10+ support required
- Responsive design for various screen sizes (5" to 7" smartphones)
- Support for system dark mode (respect user preference)
- RTL language support (future consideration, not MVP)

**NFR9: Cost Efficiency**
- Infrastructure costs must stay within free tiers where possible (AWS, Google Cloud)
- Map API costs must not exceed $500/month for 10,000 MAU
- Photo storage must leverage compression to minimize costs
- Currency/weather API usage must be cached to minimize requests

---

## User Interface Design Goals

### Overall UX Vision

WanderNote embraces a **calm, intentional design philosophy** that encourages mindful travel planning and authentic documentation. The UI should feel like a personal travel companion—friendly, unobtrusive, and supportive—rather than a demanding or overwhelming tool.

**Key UX Principles:**
- **Simplicity over feature density:** Each screen has clear primary action, minimal cognitive load
- **Content-first design:** User's content (photos, notes, maps) takes center stage, UI fades into background
- **Progressive disclosure:** Advanced features hidden until needed, onboarding guides users naturally
- **Emotional design:** Subtle animations, warm color palette, and thoughtful micro-interactions create delightful experience
- **Respectful of attention:** No infinite scroll, no manipulative patterns, no notification spam
- **Mobile-optimized gestures:** Swipe, tap, long-press interactions feel natural and efficient

**Design Inspiration:**
- Day One (journaling app) - Content-first, beautiful typography, emotional resonance
- Things 3 (task manager) - Clean hierarchy, calm palette, purposeful animations
- Mapbox (mapping) - Elegant map integration, clear visual language

---

### Key Interaction Paradigms

**1. Tab-Based Navigation**
- Primary navigation via bottom tab bar (Plan, Map, Journal, Budget, Profile)
- Persistent tab bar allows quick context switching during trip
- Badge indicators show unviewed updates in group trips

**2. Contextual Actions**
- Floating action button (FAB) for primary action on each screen
- Swipe gestures for quick actions (delete expense, reorder events)
- Long-press for contextual menus (edit, duplicate, share)

**3. Timeline-Based Content**
- Trip documentation organized chronologically by day
- Vertical scrolling timeline with clear day separators
- "Add content" prompts inline with timeline flow

**4. Modal Workflows**
- Full-screen modals for content creation (new trip, add note, record voice memo)
- Bottom sheets for quick edits and settings
- Clear escape hatches (cancel, back, close) always visible

**5. Real-Time Collaboration**
- Subtle indicators showing when other group members are viewing/editing
- Non-blocking sync: local changes save immediately, sync in background
- Conflict-free: last-write-wins for most content, additive for collections

---

### Core Screens and Views

**Authentication Flow:**
1. **Welcome Screen** - App branding, "Sign Up" and "Log In" CTAs
2. **Sign Up Screen** - Email, password, name input with validation
3. **Login Screen** - Email, password input with "Forgot Password" link
4. **Onboarding (First Launch)** - 3-screen tour highlighting key features

**Main Application:**

5. **Trip List Screen (Home)** - Card-based list of all trips (upcoming, active, past), FAB to create new trip
6. **Create/Edit Trip Screen** - Form for trip details (title, destination, dates, theme), date picker, autocomplete for destinations
7. **Trip Detail Screen** - Hub showing trip summary, itinerary preview, documentation preview, budget summary, group members
8. **Itinerary Screen** - Day-by-day timeline, expandable days showing events, FAB to add event, drag handles for reordering
9. **Add/Edit Event Screen** - Time picker, location search, notes field, weather indicator for selected day
10. **Map Screen** - Full-screen map with location pins, route lines between events, bottom sheet with event details, "Navigate" button
11. **Journal Screen** - Chronological feed of all documentation (notes, photos, voice memos, drawings), filter by type, FAB to add content
12. **Add Note Screen** - Rich text editor with formatting toolbar, day association picker
13. **Photo Gallery Screen** - Grid view of all trip photos, tap for full-screen view, caption editing
14. **Voice Memo Recorder Screen** - Waveform visualization, record/pause/stop controls, playback after recording
15. **Drawing Canvas Screen** - Drawing tools toolbar, color picker, stroke width slider, save/cancel actions
16. **Budget Screen** - Budget progress circle, expense list grouped by category, add expense FAB, split summary for groups
17. **Add/Edit Expense Screen** - Amount input, currency picker, category selector, split toggle, date picker
18. **Split Summary Screen** - "Who owes whom" calculations, settle debt buttons, transaction history
19. **Export Screen** - Preview of export format, content selection checkboxes, export format toggle (PDF/Markdown), share button
20. **Group Management Screen** - Member list with roles, invite link generator, remove member actions
21. **Profile Screen** - User info, settings sections, logout button
22. **Settings Screen** - Notification preferences, default currency, app version, privacy policy, delete account

---

### Accessibility

**Target Level:** WCAG AA Compliance

**Requirements:**
- All interactive elements have minimum 44x44pt touch targets
- Color is not the only means of conveying information (text labels, icons)
- Text contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- VoiceOver (iOS) and TalkBack (Android) support for screen readers
- Dynamic type support (respect system font size preferences)
- Reduced motion support (respect system animation preferences)
- Keyboard navigation support (for future tablet/desktop versions)

**Assumptions:**
- Primary accessibility concerns are visual (color blindness, low vision)
- Screen reader support is important but not primary usage pattern
- Internationalization (i18n) and RTL support are Phase 2 considerations

---

### Branding

**Visual Identity:**
- **Color Palette:** Warm, inviting colors inspired by travel
  - Primary: Teal/turquoise (wanderlust, exploration) #2D9CDB
  - Secondary: Sunset orange (adventure, energy) #F2994A
  - Neutral: Warm grays for backgrounds and text
  - Success: Green for budget on-track, completed states
  - Warning: Amber for budget warnings
  - Error: Coral red (softer than harsh red)

- **Typography:**
  - Headers: SF Pro Display (iOS) / Roboto (Android) - system fonts for familiarity
  - Body: SF Pro Text / Roboto - optimized for readability
  - Monospace: SF Mono / Roboto Mono for dates, times, currency

- **Iconography:**
  - SF Symbols (iOS) / Material Icons (Android) for consistency
  - Custom icons for trip themes, documentation types
  - Outlined style for inactive states, filled for active

- **Photography/Imagery:**
  - User-generated content takes center stage
  - Empty states use simple illustrations (not photographs)
  - Onboarding uses minimal, aspirational travel imagery

- **Voice & Tone:**
  - Friendly and encouraging, not corporate or robotic
  - "You" language (second person) for direct connection
  - Positive framing ("Add your first note!" not "No notes yet")
  - Minimal jargon, accessible to non-technical users

**App Icon:**
- Simple, recognizable mark (compass, map pin, or notebook motif)
- Teal/turquoise primary color for shelf presence
- No text in icon (works at all sizes, international)

---

### Target Device and Platforms

**Platforms:** Cross-platform (React Native)

**Devices:**
- iOS: iPhone SE (2022), iPhone 13/14/15 standard and Pro models, optimized for 6.1" and 6.7" screens
- Android: Mid-range to flagship phones (Samsung Galaxy S series, Google Pixel), optimized for 1080p screens

**Not Initially Optimized For:**
- Tablets (iPad, Android tablets) - works but not optimized layout
- Foldable devices - works in standard mode
- Smartwatches - no companion app in MVP

**Responsive Strategy:**
- Mobile-first design (5" to 7" smartphones primary target)
- Adaptive layouts for various aspect ratios
- Safe area insets for notched devices
- Graceful scaling for very small (<5") or large (>7") screens

---

## Technical Assumptions

### Repository Structure

**Architecture:** Monorepo

**Rationale:**
- Single source of truth for mobile app and backend API
- Simplified dependency management and versioning
- Easier to share type definitions between frontend and backend
- Streamlined CI/CD with single repository

**Structure:**
```
wandernote/
├── mobile/                 # React Native mobile app
│   ├── src/
│   ├── ios/
│   ├── android/
│   └── package.json
├── backend/                # Java Spring Boot API
│   ├── src/main/java/
│   └── pom.xml
├── shared/                 # Shared types, constants
└── README.md
```

**Tools:**
- Workspace management: npm workspaces or Yarn workspaces
- CI/CD: GitHub Actions or GitLab CI
- Version control: Git with trunk-based development

---

### Service Architecture

**Architecture:** Monolith (MVP), Microservices-ready (Phase 2)

**MVP Approach:**
- Single Spring Boot application serving RESTful API
- Modular code organization by domain (trips, documentation, budget, users)
- Vertical slices within monolith for future extraction

**Rationale:**
- Faster development and deployment for MVP
- Simpler operational overhead (single service to monitor)
- Easier debugging and development workflow
- Can decompose into microservices post-launch if traffic demands

**Future Decomposition Path (Phase 2):**
- Trip Service (planning, itinerary)
- Documentation Service (notes, photos, media storage)
- Budget Service (expenses, splitting, currency)
- User Service (auth, profiles, groups)
- Sync Service (real-time collaboration, notifications)

---

### Testing Requirements

**Testing Strategy:** Unit + Integration Testing

**Unit Testing:**
- Backend: JUnit 5 for Spring Boot, minimum 80% code coverage for business logic
- Frontend: Jest + React Native Testing Library, minimum 70% coverage for components/utilities
- Critical paths (auth, expense splitting, data sync) require 90%+ coverage

**Integration Testing:**
- API integration tests using Spring Boot Test
- Database integration tests with test containers (PostgreSQL)
- External API mocks for maps, weather, currency services
- React Native E2E tests for critical user flows (create trip, add expense, export)

**Manual Testing:**
- Beta testing with 10-20 users before public launch
- Device testing on physical iOS and Android devices (minimum 3 devices each platform)
- Usability testing for onboarding and primary flows

**CI/CD Requirements:**
- All tests must pass before merge to main branch
- Automated builds triggered on pull requests
- Automated deployment to staging environment
- Manual approval gate for production releases

**Not in MVP:**
- Load testing / performance testing (Phase 2)
- Comprehensive E2E test suite (basic flows only)
- Visual regression testing
- Accessibility automated testing (manual audit instead)

---

### Additional Technical Assumptions and Requests

**Database:**
- **PostgreSQL** as primary relational database
- Schema versioning with Flyway or Liquibase migrations
- Connection pooling with HikariCP
- Full-text search for note content (PostgreSQL built-in)

**File Storage:**
- **AWS S3** (or S3-compatible) for photos, voice memos, drawings
- Pre-signed URLs for secure upload/download
- Image compression before upload (client-side)
- CDN for serving media (CloudFront or similar)

**Authentication:**
- **JWT (JSON Web Tokens)** for stateless authentication
- Refresh token mechanism for long-lived sessions
- OAuth 2.0 for optional Google/Apple sign-in (Phase 2)
- Secure token storage (Keychain on iOS, Keystore on Android)

**APIs & Integrations:**
- **Maps:** Mapbox preferred for cost efficiency (fallback: Google Maps)
- **Weather:** OpenWeatherMap or WeatherAPI (free tier sufficient)
- **Currency:** ExchangeRate-API or Open Exchange Rates (daily rate fetching)
- **Analytics:** Minimal, privacy-respecting analytics (PostHog or self-hosted Plausible)

**Mobile State Management:**
- **Redux Toolkit** or **Zustand** for global state
- React Context for theme, auth state
- React Query for server state management and caching

**Offline & Caching:**
- **AsyncStorage** for local persistence (trip data, user preferences)
- **React Query** for intelligent caching of API responses
- **Service Worker** approach for PWA (Phase 2)
- Optimistic UI updates with background sync

**Real-Time Sync (Group Trips):**
- Polling-based approach for MVP (fetch updates every 30 seconds when viewing shared trip)
- WebSocket or Server-Sent Events for Phase 2 true real-time
- Last-write-wins conflict resolution for MVP (no complex CRDTs)

**Monitoring & Logging:**
- **Sentry** for error tracking and crash reporting
- **Structured logging** in backend (JSON format)
- **CloudWatch** or equivalent for infrastructure monitoring
- Basic usage analytics (trip creation, export events) with privacy-first approach

**Deployment:**
- **Docker** containers for backend service
- **Kubernetes** or **AWS ECS** for orchestration (or simpler: AWS Elastic Beanstalk)
- **CodePipeline** or **GitHub Actions** for CI/CD
- Blue-green deployment or canary releases for zero-downtime

**Security Hardening:**
- API rate limiting (100 req/min per user)
- SQL injection protection (parameterized queries)
- XSS protection (input sanitization, CSP headers)
- CORS configured for mobile app origins only
- Regular dependency updates and vulnerability scanning

---

## Epic List

**Epic 1: Foundation & Authentication**
**Goal:** Establish project infrastructure, user authentication, and onboarding flow so users can register, log in, and access the app securely.

**Epic 2: Trip Planning Core**
**Goal:** Enable users to create trips with themes, build daily itineraries with events, and view weather forecasts to support basic trip planning functionality.

**Epic 3: Map Integration & Navigation**
**Goal:** Integrate map functionality allowing users to visualize trip locations, pin events on maps, view routes, and navigate to destinations for location-aware trip planning.

**Epic 4: Documentation - Multimedia Capture**
**Goal:** Provide rich documentation tools including text notes, photo uploads, drawings, and voice memos so users can capture travel experiences in real-time through multiple creative formats.

**Epic 5: Budget Tracking & Currency**
**Goal:** Implement budget management with expense tracking, currency conversion, and visual spending analysis to help users manage trip finances effectively.

**Epic 6: Group Collaboration & Expense Splitting**
**Goal:** Enable small groups (2-4 people) to collaborate on trips with shared planning, documentation, and automated expense splitting to coordinate group travel seamlessly.

**Epic 7: Export & Trip Completion**
**Goal:** Allow users to export completed trips as PDF or Markdown documents with all documentation, creating shareable keepsakes and marking trips as complete.

**Epic 8: Polish, Performance & Launch Readiness**
**Goal:** Optimize app performance, implement offline viewing, refine UI/UX based on beta feedback, and prepare for production launch with monitoring and analytics.

---

## Epic 1: Foundation & Authentication

**Epic Goal:** Establish project infrastructure, user authentication, and onboarding flow so users can register, log in, and access the app securely. This epic delivers the foundational technical setup and first user-facing functionality: account creation and access.

---

### Story 1.1: Project Setup - Mobile App

**As a developer,**
**I want** the React Native mobile project initialized with proper structure and tooling,
**so that** I can start building features on a solid foundation.

**Acceptance Criteria:**
1. React Native project created with TypeScript support
2. Project structure follows standard conventions (src/, components/, screens/, services/, etc.)
3. ESLint and Prettier configured for code quality
4. iOS and Android builds successfully generate and run on simulators/emulators
5. Basic navigation setup (React Navigation) with placeholder screens
6. Package.json includes all required dependencies (Redux, React Query, etc.)
7. README includes setup instructions for new developers

---

### Story 1.2: Project Setup - Backend API

**As a developer,**
**I want** the Java Spring Boot backend project initialized with database and REST API foundation,
**so that** the mobile app can communicate with a secure backend service.

**Acceptance Criteria:**
1. Spring Boot project created with Maven or Gradle
2. PostgreSQL database configured locally with connection pooling
3. Flyway or Liquibase configured for database migrations
4. Basic REST API structure with health check endpoint (/api/health)
5. CORS configured to allow mobile app requests
6. Application.yml/properties configured for dev environment
7. README includes setup and run instructions
8. Docker Compose file for local PostgreSQL instance

---

### Story 1.3: User Registration

**As a new user,**
**I want** to register for an account with email and password,
**so that** I can start using WanderNote to plan my trips.

**Acceptance Criteria:**
1. Registration screen accessible from welcome screen
2. Form includes: email, password, confirm password, full name
3. Email validation: format check, uniqueness check against existing users
4. Password validation: minimum 8 characters, must include letter and number
5. Confirm password validation: matches password field
6. Backend API endpoint POST /api/auth/register creates user with hashed password (bcrypt)
7. Success: User automatically logged in, redirected to onboarding
8. Error handling: Clear messages for duplicate email, weak password, network errors
9. Loading state shown during registration request

---

### Story 1.4: User Login

**As a returning user,**
**I want** to log in with my email and password,
**so that** I can access my trips and travel documentation.

**Acceptance Criteria:**
1. Login screen accessible from welcome screen
2. Form includes: email, password
3. Backend API endpoint POST /api/auth/login validates credentials
4. Success: JWT token returned and stored securely (Keychain/Keystore)
5. Success: User redirected to trip list screen
6. Error handling: Clear message for invalid credentials, network errors
7. "Forgot Password" link visible and navigates to password reset screen
8. "Remember me" checkbox keeps user logged in across app restarts
9. Loading state shown during login request

---

### Story 1.5: Password Reset

**As a user who forgot their password,**
**I want** to reset my password via email,
**so that** I can regain access to my account.

**Acceptance Criteria:**
1. Password reset screen accessible from login screen
2. User enters email address
3. Backend API endpoint POST /api/auth/forgot-password sends reset email with secure token
4. Email contains reset link valid for 24 hours
5. Clicking link opens app to reset password screen (or web fallback with deep link)
6. Reset screen validates new password (same rules as registration)
7. Success: Password updated, user redirected to login screen with success message
8. Error handling: Invalid token, expired token, email not found
9. Rate limiting: Maximum 3 reset requests per email per hour

---

### Story 1.6: Welcome & Onboarding Flow

**As a first-time user,**
**I want** to see an introduction to WanderNote's key features,
**so that** I understand how to use the app effectively.

**Acceptance Criteria:**
1. Welcome screen shown on first app launch with app logo and tagline
2. "Sign Up" and "Log In" buttons prominently displayed
3. After successful registration, onboarding carousel shown (3 screens)
4. Onboarding screens highlight: (1) Plan themed trips, (2) Document with multimedia, (3) Track budget and split expenses
5. Each screen has illustration/screenshot, heading, and brief description
6. "Next" button advances to next screen, "Skip" button skips to app
7. Final onboarding screen has "Get Started" button leading to trip list
8. Onboarding shown only once (persistent flag stored locally)
9. Users can access onboarding again from settings if needed

---

### Story 1.7: User Profile & Settings Foundation

**As a logged-in user,**
**I want** to view and edit my profile information and access app settings,
**so that** I can manage my account and preferences.

**Acceptance Criteria:**
1. Profile screen accessible from bottom tab navigation
2. Displays: profile photo (placeholder if none), full name, email address
3. "Edit Profile" button navigates to edit screen
4. Edit screen allows updating: full name, profile photo (upload from gallery/camera)
5. Backend API endpoint PATCH /api/users/me updates user profile
6. Settings section includes: default currency preference, notification preferences (placeholder for now)
7. "Change Password" option navigates to change password flow
8. "Log Out" button clears auth token and returns to welcome screen
9. "Delete Account" option navigates to account deletion confirmation
10. All changes saved successfully with confirmation message

---

### Story 1.8: CI/CD Pipeline Setup

**As a developer,**
**I want** automated build and test pipelines for mobile and backend,
**so that** code quality is maintained and deployments are reliable.

**Acceptance Criteria:**
1. GitHub Actions (or GitLab CI) workflows configured for both mobile and backend
2. Mobile pipeline: lint, unit tests, build iOS and Android
3. Backend pipeline: compile, unit tests, integration tests
4. Pipelines triggered on: pull requests, merges to main
5. Pull requests require passing tests before merge
6. Backend deployments to staging environment on main branch merge
7. Docker image built and pushed to container registry
8. Staging environment accessible for testing (backend API)
9. Rollback mechanism documented in case of failed deployment

---

## Epic 2: Trip Planning Core

**Epic Goal:** Enable users to create trips with themes, build daily itineraries with events, and view weather forecasts to support basic trip planning functionality. This epic delivers the core trip management experience.

---

### Story 2.1: Create New Trip

**As a user,**
**I want** to create a new trip with destination, dates, and theme,
**so that** I can start planning my travel experience.

**Acceptance Criteria:**
1. Trip list screen (home) displays "+" FAB button
2. Tapping FAB opens "Create Trip" modal screen
3. Form fields: Trip title (required), Destination (city/village with autocomplete), Start date, End date, Theme/Purpose (dropdown or custom text)
4. Theme options include: Adventure, Culture, Food, Relaxation, Nature, Custom (freeform text)
5. Date picker enforces start date ≤ end date
6. Backend API endpoint POST /api/trips creates trip and returns trip ID
7. Success: Modal closes, user redirected to new trip detail screen
8. New trip visible in trip list with thumbnail, title, dates, and theme icon
9. Validation: All required fields filled, end date after start date
10. Error handling: Network errors, validation failures with clear messages

---

### Story 2.2: View Trip List

**As a user,**
**I want** to see all my trips organized by status (upcoming, active, past),
**so that** I can easily access the trip I want to work on.

**Acceptance Criteria:**
1. Trip list screen is default landing screen after login
2. Trips grouped into tabs or sections: Upcoming (future trips), Active (trips with start date ≤ today ≤ end date), Past (completed trips)
3. Each trip card displays: cover photo (if set) or default image, title, destination, dates, theme icon
4. Tapping trip card navigates to trip detail screen
5. Backend API endpoint GET /api/trips returns user's trips
6. Empty state shown when no trips exist: "Start your first adventure!" with CTA to create trip
7. Pull-to-refresh reloads trip list
8. Loading state shown while fetching trips
9. Trips sorted by start date (ascending for upcoming/active, descending for past)

---

### Story 2.3: Edit and Delete Trip

**As a user,**
**I want** to edit trip details or delete trips I no longer need,
**so that** I can keep my trip list accurate and organized.

**Acceptance Criteria:**
1. Trip detail screen has "..." menu with "Edit Trip" and "Delete Trip" options
2. "Edit Trip" opens same form as create trip, pre-filled with existing data
3. Backend API endpoint PATCH /api/trips/{id} updates trip details
4. Changes saved successfully with confirmation toast
5. "Delete Trip" shows confirmation dialog: "Delete [trip name]? This will permanently delete all itinerary, documentation, and expenses."
6. Confirmation dialog has "Cancel" and "Delete" buttons
7. Backend API endpoint DELETE /api/trips/{id} removes trip and all associated data (cascade delete)
8. Success: Trip removed from list, user returned to trip list screen
9. Error handling: Network errors, unauthorized access (if group trip and not creator)

---

### Story 2.4: Create and View Itinerary

**As a user,**
**I want** to build a daily itinerary for my trip with timed events,
**so that** I can organize my activities and explore my destination efficiently.

**Acceptance Criteria:**
1. Trip detail screen has "Itinerary" tab or section prominently displayed
2. Itinerary view shows timeline of days from trip start to end date
3. Each day is collapsible/expandable section with date and day of week
4. Each day shows list of events (if any) with time, title, and location name
5. Empty day shows "+ Add Event" prompt
6. Tapping day or "+ Add Event" opens event creation screen
7. Backend API endpoint GET /api/trips/{id}/itinerary returns all events grouped by day
8. Backend API endpoint POST /api/trips/{id}/events creates new event
9. Event fields: Title (required), Time (optional), Location (autocomplete), Notes (optional)
10. Events within a day sorted by time (all-day events first, then chronological)

---

### Story 2.5: Edit and Delete Itinerary Events

**As a user,**
**I want** to edit or delete events in my itinerary,
**so that** I can adjust plans as my trip evolves.

**Acceptance Criteria:**
1. Tapping event in itinerary opens event detail view or edit modal
2. Edit modal pre-filled with existing event data
3. Backend API endpoint PATCH /api/trips/{id}/events/{eventId} updates event
4. Changes reflected immediately in itinerary view
5. Event detail view has "Delete" button or swipe-to-delete gesture
6. Delete confirmation dialog: "Delete [event title]?"
7. Backend API endpoint DELETE /api/trips/{id}/events/{eventId} removes event
8. Deleted event removed from itinerary immediately
9. Undo option shown briefly after delete (toast with "Undo" button, 5 second timeout)
10. Error handling: Network errors, validation failures

---

### Story 2.6: Reorder Itinerary Events

**As a user,**
**I want** to reorder events within a day by dragging,
**so that** I can optimize my itinerary without manually editing times.

**Acceptance Criteria:**
1. Events within a day have drag handle icon visible
2. Long-press on event activates drag mode
3. While dragging, other events shift to show drop position
4. Dropping event updates order in UI immediately (optimistic update)
5. Backend API endpoint PATCH /api/trips/{id}/events/reorder updates event order
6. If backend update fails, revert to previous order with error message
7. Reordering updates event times automatically (e.g., 1-hour increments) or keeps times if manually set
8. Smooth animations during drag and drop

---

### Story 2.7: Weather Forecast Integration

**As a user,**
**I want** to see weather forecasts for my trip dates,
**so that** I can plan indoor/outdoor activities appropriately.

**Acceptance Criteria:**
1. Itinerary view shows weather icon and temperature for each day
2. Weather data fetched from OpenWeatherMap or similar API
3. Backend API endpoint GET /api/trips/{id}/weather returns forecast
4. Weather includes: temperature (high/low), condition (sunny, rainy, etc.), icon
5. Weather displayed prominently at top of each day section
6. Weather data cached for 24 hours to minimize API calls
7. Tapping weather shows expanded forecast details (hourly forecast, humidity, wind)
8. If weather API unavailable, show graceful fallback: "Weather unavailable" (not error)
9. Weather only shown for future/current dates (not past trips)

---

## Epic 3: Map Integration & Navigation

**Epic Goal:** Integrate map functionality allowing users to visualize trip locations, pin events on maps, view routes, and navigate to destinations for location-aware trip planning.

---

### Story 3.1: Map View with Trip Locations

**As a user,**
**I want** to see all my trip events displayed on an interactive map,
**so that** I can visualize my itinerary geographically and plan routes.

**Acceptance Criteria:**
1. "Map" tab in bottom navigation accessible from any screen
2. Map view loads using Mapbox (or Google Maps fallback)
3. All events with locations from current trip shown as pins on map
4. Pins color-coded by day (e.g., Day 1 blue, Day 2 green, etc.)
5. Map auto-zooms to fit all pins on initial load
6. Tapping pin shows callout with event title and time
7. Tapping callout navigates to event detail view
8. Map supports standard gestures: pan, zoom, rotate
9. Current location shown if user grants location permission
10. Graceful handling if no events have locations (empty state with helpful message)

---

### Story 3.2: Location Search and Pin Placement

**As a user,**
**I want** to search for locations and add them to events,
**so that** I can easily find and save points of interest for my trip.

**Acceptance Criteria:**
1. Event creation/edit screen has location field with search functionality
2. Typing in location field triggers autocomplete suggestions from map provider
3. Suggestions show place name, address, distance from trip destination
4. Selecting suggestion saves location coordinates and name to event
5. Event location includes: name, address, latitude, longitude
6. Backend API endpoint stores location data with event
7. Alternative: Long-press on map to drop pin at custom location
8. Custom pins show coordinates and allow naming
9. Location search works offline using cached recent searches (if available)
10. Clear button to remove location from event

---

### Story 3.3: Route Visualization

**As a user,**
**I want** to see routes between consecutive events on the map,
**so that** I can estimate travel time and plan efficient paths.

**Acceptance Criteria:**
1. Map view displays polyline routes connecting events in chronological order
2. Routes calculated using map provider's directions API (walking mode default)
3. Routes color-matched to day groupings for clarity
4. Tapping route displays travel time and distance in callout
5. Backend API endpoint GET /api/trips/{id}/routes returns route data
6. Route data cached to minimize API calls
7. If route calculation fails, show straight line with distance estimation
8. Option to toggle route display on/off in map settings
9. Routes update automatically when events are reordered

---

### Story 3.4: Navigate to Location

**As a user,**
**I want** to open navigation to an event location in my preferred maps app,
**so that** I can get turn-by-turn directions during my trip.

**Acceptance Criteria:**
1. Event detail view has "Navigate" button prominently displayed
2. Tapping "Navigate" opens device native maps app (Apple Maps on iOS, Google Maps on Android)
3. Maps app pre-filled with destination coordinates and name
4. If user has alternative maps apps installed, show app picker (Google Maps, Waze, etc.)
5. Deep link format: maps://?daddr={lat},{lng} for iOS, geo:{lat},{lng} for Android
6. Fallback: If native maps unavailable, show in-app map with directions
7. "Navigate" button only visible for events with valid coordinates
8. Button displays estimated travel time from current location if available

---

### Story 3.5: Save Favorite Locations

**As a user,**
**I want** to save favorite locations for quick reuse in future trips,
**so that** I don't have to search for the same places repeatedly.

**Acceptance Criteria:**
1. Event detail view has "Save to Favorites" button (star icon)
2. Tapping star saves location to user's favorites list
3. Backend API endpoint POST /api/users/favorites creates favorite location
4. Favorites stored with: name, address, coordinates, category (optional)
5. Location search in event creation shows favorites section at top of results
6. Favorites accessible from profile/settings screen
7. User can remove locations from favorites
8. Favorites persist across devices (synced to backend)
9. Maximum 50 favorites per user to prevent abuse

---

### Story 3.6: Offline Map Viewing

**As a user,**
**I want** to view my trip map when offline,
**so that** I can navigate even without internet access while traveling.

**Acceptance Criteria:**
1. Map tiles cached automatically when user views map online
2. Cached tiles stored locally on device with reasonable expiration (30 days)
3. Offline indicator shown when viewing cached maps
4. Event pins and routes visible offline using cached data
5. Location search and route calculation disabled offline with clear message
6. Offline map covers trip destination area plus reasonable radius
7. User can manually trigger "Download for offline" in trip settings
8. Offline map size shown before download (e.g., "45 MB for Paris area")
9. Downloaded maps manageable from settings (view size, delete to free space)

---

## Epic 4: Documentation - Multimedia Capture

**Epic Goal:** Provide rich documentation tools including text notes, photo uploads, drawings, and voice memos so users can capture travel experiences in real-time through multiple creative formats.

---

### Story 4.1: Create Rich Text Notes

**As a user,**
**I want** to write formatted notes during my trip,
**so that** I can document my thoughts, experiences, and reflections in detail.

**Acceptance Criteria:**
1. Journal screen (bottom tab) shows feed of all documentation
2. "+ Add Note" FAB opens rich text editor screen
3. Editor supports: bold, italic, headings (H1, H2), bullet lists, numbered lists
4. Formatting toolbar appears above keyboard
5. Note creation screen includes: day association picker (defaults to today), title field (optional), body field (required)
6. Backend API endpoint POST /api/trips/{id}/notes creates note
7. Note saved with timestamp, day association, and content HTML
8. Success: Editor closes, new note appears in journal feed immediately
9. Character count shown (no hard limit, but warning if >10,000 characters)
10. Auto-save draft locally every 30 seconds to prevent data loss

---

### Story 4.2: Edit and Delete Notes

**As a user,**
**I want** to edit or delete my notes,
**so that** I can refine my documentation or remove unwanted entries.

**Acceptance Criteria:**
1. Tapping note in journal feed opens note detail view
2. Note detail shows formatted text, timestamp, day association
3. "Edit" button opens note in rich text editor pre-filled with content
4. Backend API endpoint PATCH /api/trips/{id}/notes/{noteId} updates note
5. Changes reflected immediately in journal feed
6. "Delete" button shows confirmation: "Delete this note?"
7. Backend API endpoint DELETE /api/trips/{id}/notes/{noteId} removes note
8. Deleted note removed from feed immediately
9. Undo option shown for 5 seconds after delete
10. Search functionality: Users can search notes by keyword from journal screen

---

### Story 4.3: Upload and Organize Photos

**As a user,**
**I want** to add photos to my trip with captions,
**so that** I can visually document my experiences and memories.

**Acceptance Criteria:**
1. Journal screen has "+ Add Photos" option (or multi-add from FAB menu)
2. Tapping opens device photo picker (gallery or camera)
3. User can select multiple photos at once (up to 20 per batch)
4. Selected photos displayed in preview screen with caption fields
5. Each photo can have: caption (optional), day association, location (auto-detected from EXIF if available)
6. Backend API endpoint POST /api/trips/{id}/photos uploads photos
7. Photos compressed before upload (max 2MB per photo, maintain aspect ratio)
8. Upload progress shown (progress bar for batch)
9. Success: Photos appear in journal feed immediately with captions
10. Photos displayed in grid or carousel view with timestamps

---

### Story 4.4: Photo Gallery and Full-Screen View

**As a user,**
**I want** to view all my trip photos in a gallery and see them full-screen,
**so that** I can enjoy and review my visual documentation.

**Acceptance Criteria:**
1. Journal screen has "Photos" filter to show photos only
2. Photos displayed in grid layout (3 columns, square thumbnails)
3. Tapping photo opens full-screen gallery view
4. Full-screen view supports: swipe left/right to navigate, pinch-to-zoom, double-tap to zoom
5. Gallery shows photo caption, timestamp, location (if available) overlaid
6. "i" button shows photo metadata: date taken, file size, camera info
7. Share button allows sharing photo via device share sheet
8. Delete button removes photo with confirmation
9. Gallery supports both portrait and landscape orientations
10. Back button or swipe down exits gallery to journal feed

---

### Story 4.5: Drawing and Sketching Tools

**As a user,**
**I want** to create simple drawings or annotate photos,
**so that** I can add creative visual documentation to my trip.

**Acceptance Criteria:**
1. Journal screen has "+ Add Drawing" option from FAB menu
2. Opens drawing canvas screen with blank white canvas
3. Drawing tools: Pen, Eraser, Color picker (8-12 preset colors), Stroke width slider
4. Undo and Redo buttons available
5. "Save" button saves drawing as image
6. Backend API endpoint POST /api/trips/{id}/drawings uploads drawing
7. Drawings appear in journal feed with thumbnail
8. Alternative: "Annotate Photo" option allows drawing on existing trip photo
9. Annotated photos saved as new image (original preserved)
10. Drawing canvas supports both portrait and landscape orientations

---

### Story 4.6: Record and Playback Voice Memos

**As a user,**
**I want** to record audio voice memos during my trip,
**so that** I can capture my thoughts and impressions without typing.

**Acceptance Criteria:**
1. Journal screen has "+ Record Voice Memo" option from FAB menu
2. Opens voice memo recorder screen with waveform visualization
3. Red record button starts recording, tap again to pause, tap again to resume
4. Recording shows elapsed time and waveform animation
5. "Stop" button ends recording and shows playback screen
6. Playback screen has: play/pause button, seek slider, duration, day association picker
7. Backend API endpoint POST /api/trips/{id}/voice-memos uploads audio file
8. Audio compressed to AAC or MP3 format (max 10MB per memo, ~10 minutes)
9. Voice memos appear in journal feed with audio player widget
10. Player widget shows: play/pause, duration, waveform thumbnail

---

### Story 4.7: Journal Feed with Filters

**As a user,**
**I want** to view all my documentation in a chronological feed with filtering options,
**so that** I can browse my trip story or find specific types of content.

**Acceptance Criteria:**
1. Journal screen (bottom tab) shows unified feed of all documentation types
2. Feed sorted chronologically by day and timestamp (newest first within each day)
3. Day headers separate content by date
4. Each entry shows: type icon (note, photo, voice, drawing), preview, timestamp
5. Filter buttons at top: All, Notes, Photos, Voice Memos, Drawings
6. Tapping filter updates feed to show only selected type
7. Pull-to-refresh reloads journal feed
8. Infinite scroll loads older entries as user scrolls
9. Empty state when no documentation: "Start documenting your trip!"
10. Search bar allows searching notes by keyword (not MVP: search in captions/transcripts)

---

## Epic 5: Budget Tracking & Currency

**Epic Goal:** Implement budget management with expense tracking, currency conversion, and visual spending analysis to help users manage trip finances effectively.

---

### Story 5.1: Set Trip Budget

**As a user,**
**I want** to set an overall budget for my trip in my preferred currency,
**so that** I can track my spending against a target.

**Acceptance Criteria:**
1. Trip creation flow includes optional "Budget" field
2. Budget screen accessible from trip detail or bottom tab
3. If no budget set, screen shows "+ Set Budget" CTA
4. Budget setup includes: total amount, currency selector (major currencies: USD, EUR, GBP, JPY, etc.)
5. Backend API endpoint POST /api/trips/{id}/budget creates budget
6. Budget stored with: amount, currency code (ISO 4217)
7. Success: Budget displayed prominently on budget screen
8. Users can edit budget anytime (same flow)
9. Budget vs. actual spending shown as progress circle or bar
10. Color coding: Green (under budget), Yellow (80-100%), Red (over budget)

---

### Story 5.2: Add Manual Expenses

**As a user,**
**I want** to quickly log expenses during my trip,
**so that** I can track my actual spending in real-time.

**Acceptance Criteria:**
1. Budget screen has "+ Add Expense" FAB button
2. Add expense form includes: amount (required), currency (defaults to budget currency), category (dropdown), description (optional), date (defaults to today)
3. Categories: Food, Transport, Lodging, Activities, Shopping, Other
4. Backend API endpoint POST /api/trips/{id}/expenses creates expense
5. Expense appears immediately in expense list on budget screen
6. Expense list shows: description, amount in budget currency (converted if needed), category icon, date
7. Total spending updated immediately in budget progress indicator
8. Form validates: amount > 0, valid currency, valid date within trip range
9. Success confirmation: Toast message "Expense added"
10. Quick add shortcuts: Pre-filled categories (e.g., "Coffee: $5" templates)

---

### Story 5.3: Currency Conversion

**As a user,**
**I want** expenses in foreign currencies automatically converted to my budget currency,
**so that** I can track my total spending accurately.

**Acceptance Criteria:**
1. Adding expense in different currency triggers conversion to budget currency
2. Backend fetches exchange rates from ExchangeRate-API or Open Exchange Rates
3. Exchange rates cached for 24 hours to minimize API calls
4. Expense stored with: original amount, original currency, converted amount, exchange rate used
5. Expense list displays both original and converted amounts (e.g., "¥1000 (~$7.50)")
6. Tapping expense shows full details including exchange rate and conversion date
7. Budget progress calculation uses converted amounts in budget currency
8. Manual exchange rate refresh available (pull-to-refresh on budget screen)
9. If API unavailable, use last known rates with warning indicator
10. Support for 20+ major currencies (USD, EUR, GBP, JPY, CNY, CAD, AUD, etc.)

---

### Story 5.4: Edit and Delete Expenses

**As a user,**
**I want** to edit or delete expenses I logged incorrectly,
**so that** my budget tracking remains accurate.

**Acceptance Criteria:**
1. Tapping expense in list opens expense detail/edit screen
2. Edit screen pre-filled with expense data (amount, currency, category, description, date)
3. Backend API endpoint PATCH /api/trips/{id}/expenses/{expenseId} updates expense
4. Changes reflected immediately in expense list and budget totals
5. Recalculates currency conversion if currency or amount changed
6. Swipe-to-delete gesture on expense list item
7. Delete confirmation dialog: "Delete this expense?"
8. Backend API endpoint DELETE /api/trips/{id}/expenses/{expenseId} removes expense
9. Budget totals recalculated immediately after delete
10. Undo option shown for 5 seconds after delete

---

### Story 5.5: Expense Breakdown by Category

**As a user,**
**I want** to see my spending broken down by category,
**so that** I understand where my money is going.

**Acceptance Criteria:**
1. Budget screen shows expense breakdown section below budget progress
2. Breakdown displayed as: pie chart or bar chart showing category totals
3. Each category shows: icon, name, total amount, percentage of total spending
4. Tapping category filters expense list to show only that category
5. Category colors consistent throughout app
6. Empty categories not shown in breakdown (or shown grayed out with $0)
7. "Other" category aggregates miscellaneous expenses
8. Breakdown updates in real-time as expenses are added/edited/deleted
9. Option to toggle between chart view and list view
10. Export breakdown as image (screenshot) for sharing

---

### Story 5.6: Daily Spending Trends

**As a user,**
**I want** to see my spending trends over the course of my trip,
**so that** I can identify high-spending days and adjust accordingly.

**Acceptance Criteria:**
1. Budget screen has "Trends" tab showing daily spending graph
2. Line chart displays total spending per day from trip start to current date
3. X-axis: days of trip, Y-axis: spending amount
4. Tapping data point shows expenses for that day
5. Average daily spending line overlaid on chart
6. Projected total spending shown based on current daily average
7. Warning if projected spending exceeds budget
8. Chart scrollable if trip duration > 14 days
9. Option to filter trends by category
10. Summary stats: total spent, days remaining, average per day, projected total

---

## Epic 6: Group Collaboration & Expense Splitting

**Epic Goal:** Enable small groups (2-4 people) to collaborate on trips with shared planning, documentation, and automated expense splitting to coordinate group travel seamlessly.

---

### Story 6.1: Invite Group Members

**As a trip creator,**
**I want** to invite friends to collaborate on my trip,
**so that** we can plan together and share documentation.

**Acceptance Criteria:**
1. Trip detail screen has "Members" section showing current members
2. Trip creator sees "+ Invite Members" button
3. Invite flow options: (1) Enter email addresses, (2) Generate shareable link
4. Email invite: Backend API endpoint POST /api/trips/{id}/invites sends email to recipients
5. Email contains trip name, creator name, invitation link, "Accept" button
6. Invite link valid for 7 days
7. Maximum 4 total members per trip (including creator)
8. Invited users receive in-app notification if they have accounts
9. Invite link works for non-registered users (prompts registration then adds to trip)
10. Success: Invited members shown as "Pending" until they accept

---

### Story 6.2: Accept/Decline Trip Invitation

**As an invited user,**
**I want** to accept or decline trip invitations,
**so that** I can join trips I'm interested in and ignore others.

**Acceptance Criteria:**
1. Invited user receives email with invitation link
2. Clicking link opens app (or web if not installed, with deep link to app)
3. If not logged in, prompted to log in or register
4. Invitation screen shows: trip name, dates, creator name, "Accept" and "Decline" buttons
5. Accept: Backend API endpoint POST /api/trips/{id}/invites/accept adds user to trip members
6. Success: User redirected to trip detail screen, trip appears in their trip list
7. Decline: Backend API endpoint POST /api/trips/{id}/invites/decline marks invitation as declined
8. Declined invitations don't appear in user's trip list
9. Creator notified when member accepts (in-app notification)
10. Expired invitations show error message with option to request new invite

---

### Story 6.3: Shared Trip Viewing

**As a group member,**
**I want** to view all trip details, itinerary, and documentation shared by the group,
**so that** I stay informed and coordinated with my travel companions.

**Acceptance Criteria:**
1. Group members see identical trip detail screen (itinerary, map, journal, budget)
2. All content created by any member visible to all members
3. Content attributed to creator (e.g., "Added by Alice")
4. Real-time updates: New content appears for all members within 30 seconds (polling-based)
5. Backend API endpoint GET /api/trips/{id} includes member permissions check
6. Members cannot delete trip (only creator can)
7. Members can edit/delete only their own content by default
8. Creator has full edit/delete permissions on all content
9. "Members" section shows all members with avatars and names
10. Typing indicator shows when another member is actively viewing trip (optional polish)

---

### Story 6.4: Collaborative Documentation

**As a group member,**
**I want** to add notes, photos, and voice memos to our shared trip,
**so that** all of us can contribute to documenting our travel experiences.

**Acceptance Criteria:**
1. All documentation features (notes, photos, voice, drawings) available to all members
2. Each documentation entry shows creator attribution ("Added by Bob")
3. Backend API endpoints allow any member to create documentation
4. Journal feed shows combined documentation from all members, sorted chronologically
5. Members can edit/delete only their own documentation
6. Creator can delete any documentation (moderation)
7. Photo uploads from multiple members appear in shared gallery
8. No content conflicts: all additions are additive, no overwrites
9. Success toast: "Shared with group" after adding documentation
10. Notification to other members when new content added (optional)

---

### Story 6.5: Mark Expenses for Splitting

**As a group member,**
**I want** to mark expenses as split among specific group members,
**so that** we can fairly divide costs for shared activities and meals.

**Acceptance Criteria:**
1. Add/edit expense screen includes "Split with" toggle
2. When enabled, shows list of all group members with checkboxes
3. User can select which members to split expense with (1 to all members)
4. Default: split equally among selected members
5. Backend API endpoint POST /api/trips/{id}/expenses with split metadata
6. Expense list shows split indicator icon on split expenses
7. Tapping split expense shows split details: original payer, amount per person, list of participants
8. Split calculation: total amount / number of participants (equal split)
9. Only the person who paid can create the expense (they are "owed" by others)
10. Split expenses cannot be edited by other members (only payer can edit/delete)

---

### Story 6.6: Split Summary and Balances

**As a group member,**
**I want** to see who owes whom how much for the trip,
**so that** we can settle up easily at the end.

**Acceptance Criteria:**
1. Budget screen has "Split Summary" section (only visible for group trips)
2. Summary shows each member with their balance: amount they owe or are owed
3. Simplified calculation: net balance for each person (e.g., "Alice owes $45", "Bob is owed $30")
4. Backend API endpoint GET /api/trips/{id}/splits calculates balances
5. Algorithm minimizes number of transactions (e.g., if Alice owes Bob $20 and Bob owes Charlie $20, Alice pays Charlie directly)
6. Tapping member shows detailed transaction history: which expenses they participated in
7. "Settle" button next to each debt allows marking as paid
8. Backend API endpoint POST /api/trips/{id}/splits/settle records settlement
9. Settled debts removed from summary, balance updated
10. Settlement history visible: "Bob settled $30 with Alice on [date]"

---

### Story 6.7: Manage Group Members

**As a trip creator,**
**I want** to manage group membership by removing members if needed,
**so that** I maintain control over trip collaboration.

**Acceptance Criteria:**
1. Trip creator sees "..." menu next to each member in members list
2. Menu options: "Remove from Trip"
3. Removing member shows confirmation: "Remove [name] from trip? They will lose access to all trip data."
4. Backend API endpoint DELETE /api/trips/{id}/members/{userId} removes member
5. Removed member loses access to trip immediately
6. Trip disappears from removed member's trip list
7. Removed member's previously added content remains in trip (attributed to them)
8. Creator cannot remove themselves (must transfer ownership or delete trip)
9. Members can voluntarily leave trip via "Leave Trip" option
10. Leaving member's content remains, balances frozen at time of departure

---

## Epic 7: Export & Trip Completion

**Epic Goal:** Allow users to export completed trips as PDF or Markdown documents with all documentation, creating shareable keepsakes and marking trips as complete.

---

### Story 7.1: Mark Trip as Completed

**As a user,**
**I want** to mark my trip as completed when it's finished,
**so that** it's archived and I can export it as a keepsake.

**Acceptance Criteria:**
1. Trip detail screen has "Complete Trip" button (only shown after trip end date passes or manual trigger)
2. Tapping button shows confirmation: "Mark [trip name] as completed? You can still add documentation later."
3. Backend API endpoint PATCH /api/trips/{id}/status sets status to "completed"
4. Completed trips move to "Past" section in trip list
5. Completed trips have visual indicator (checkmark badge)
6. Users can still view and add documentation to completed trips
7. "Uncomplete" option available if user wants to reopen trip
8. Completion triggers export availability notification: "Your trip is ready to export!"
9. Completion date recorded for analytics and export metadata

---

### Story 7.2: Export Trip as PDF

**As a user,**
**I want** to export my completed trip as a PDF document,
**so that** I have a permanent, shareable keepsake of my travel experience.

**Acceptance Criteria:**
1. Completed trip detail screen has "Export" button prominently displayed
2. Export screen shows preview of export format and content selection options
3. User can toggle inclusion of: Itinerary, Notes, Photos, Voice Memos (transcripts if available), Drawings, Budget Summary
4. Backend API endpoint POST /api/trips/{id}/export generates PDF asynchronously
5. PDF includes: trip title, dates, destination, theme, creator name, all selected content
6. PDF formatted with: cover page, table of contents, chronological sections by day, embedded photos (compressed)
7. Generation progress shown (may take 10-30 seconds for photo-heavy trips)
8. Once complete, PDF download link provided or opened in device PDF viewer
9. User can share PDF via device share sheet (email, messages, cloud storage)
10. Exported PDFs stored temporarily on server (7 days) for re-download

---

### Story 7.3: Export Trip as Markdown

**As a user,**
**I want** to export my trip as Markdown format,
**so that** I can edit and customize my travel documentation in text editors or static site generators.

**Acceptance Criteria:**
1. Export screen has format toggle: PDF or Markdown
2. Markdown export includes same content selection options as PDF
3. Backend API endpoint POST /api/trips/{id}/export?format=markdown generates .md file
4. Markdown format: trip metadata in YAML frontmatter, content in Markdown syntax
5. Images referenced as relative links with separate image files in zip archive
6. Export generates .zip file containing: trip.md, images/ folder, README.txt
7. User downloads .zip file or shares via device share sheet
8. Markdown compatible with Jekyll, Hugo, Obsidian, and other Markdown tools
9. Export preserves structure: H1 for days, H2 for entries, lists for itinerary
10. README.txt includes instructions for using the export

---

### Story 7.4: Export Customization Options

**As a user,**
**I want** to customize what's included in my export,
**so that** I can create personalized versions for different audiences (e.g., public vs. private).

**Acceptance Criteria:**
1. Export screen has "Customize" section with detailed options
2. Options include: Include cover photo (yes/no), Include budget details (yes/no), Include only specific days (date range picker), Include only specific documentation types
3. Template selection: Simple, Detailed, Photo-focused (affects PDF layout)
4. Privacy option: Redact personal information (remove location coordinates, member names)
5. User selections saved as export preset for quick re-export
6. Preview button shows sample pages before full export
7. Backend respects all selections when generating export
8. Export metadata includes: export date, version, selected options
9. Users can create multiple exports with different configurations
10. "Share with Group" option sends export link to all trip members

---

## Epic 8: Polish, Performance & Launch Readiness

**Epic Goal:** Optimize app performance, implement offline viewing, refine UI/UX based on beta feedback, and prepare for production launch with monitoring and analytics.

---

### Story 8.1: Performance Optimization - Mobile App

**As a user,**
**I want** the app to be fast and responsive,
**so that** I can use it efficiently without frustrating delays.

**Acceptance Criteria:**
1. App launch time < 3 seconds on mid-range devices (measured on iPhone 13, Samsung Galaxy S21)
2. Screen transitions < 300ms (navigation animations smooth at 60fps)
3. Photo uploads complete within 5 seconds for 5MB images
4. Journal feed scrolling smooth with 100+ entries (virtualized list)
5. Map rendering smooth at 60fps during pan/zoom
6. Memory usage stays under 150MB during normal usage
7. Battery impact minimal (< 5% battery drain per hour of active use)
8. Image compression reduces photo sizes by 70% without visible quality loss
9. Lazy loading for images: load thumbnails first, full res on demand
10. Performance monitoring integrated (React Native Performance API)

---

### Story 8.2: Offline Viewing and Caching

**As a user,**
**I want** to view my trip data when offline,
**so that** I can access my plans and documentation without internet connection.

**Acceptance Criteria:**
1. All trip data cached locally after first load: trips, itinerary, notes, expense data
2. Cached photos available offline (last 100 photos per trip)
3. Map tiles cached for current trip area (10km radius around destination)
4. Offline indicator shown in UI when no internet connection detected
5. Read-only mode enforced offline: cannot create/edit content
6. "Available Offline" badge on trips with cached data in trip list
7. Manual "Download for Offline" option in trip settings
8. Cached data expires after 30 days or when storage limit reached (100MB max cache size)
9. User can clear cached data from settings to free storage
10. Sync queue: actions attempted offline saved and synced when back online

---

### Story 8.3: Error Handling and User Feedback

**As a user,**
**I want** clear, helpful error messages when things go wrong,
**so that** I understand what happened and how to fix it.

**Acceptance Criteria:**
1. All API errors show user-friendly messages (not raw error codes)
2. Network errors: "No internet connection. Please try again when online."
3. Validation errors: Inline field-level messages (e.g., "Email address is invalid")
4. Server errors (500): "Something went wrong. Please try again later." with support link
5. Authentication errors: Auto-logout and redirect to login with explanation
6. Rate limit errors: "Too many requests. Please wait [time] and try again."
7. File upload errors: "Photo upload failed. Check your connection and try again."
8. Graceful degradation: Features fail individually without crashing entire app
9. Retry mechanism: Auto-retry failed API calls with exponential backoff (3 attempts max)
10. Success feedback: Toast messages for completed actions ("Trip saved", "Photo uploaded")

---

### Story 8.4: Beta Testing and Feedback Collection

**As a product owner,**
**I want** to conduct beta testing with real users,
**so that** I can identify and fix issues before public launch.

**Acceptance Criteria:**
1. Beta program set up with 10-20 invited testers (mix of solo travelers, couples, small groups)
2. TestFlight (iOS) and Google Play Beta (Android) builds distributed
3. In-app feedback button accessible from all screens
4. Feedback form captures: issue description, screen name, optional screenshot, device info
5. Backend API endpoint POST /api/feedback stores feedback in database
6. Crash reports automatically collected via Sentry
7. Analytics events tracked: trip creation, documentation added, export triggered, etc.
8. Weekly feedback review sessions to prioritize bug fixes
9. Beta period: 2-4 weeks before public launch
10. Post-beta survey sent to all testers for qualitative feedback

---

### Story 8.5: UI/UX Refinement

**As a user,**
**I want** the app to be visually polished and intuitive,
**so that** I enjoy using it and can find features easily.

**Acceptance Criteria:**
1. All screens follow consistent design system (colors, typography, spacing)
2. Empty states have helpful illustrations and clear CTAs
3. Loading states use skeletons (not just spinners) for perceived performance
4. Animations smooth and purposeful (not distracting)
5. Icon consistency: SF Symbols (iOS), Material Icons (Android)
6. Accessibility: WCAG AA compliant (contrast ratios, touch targets 44x44pt)
7. Dark mode support (respects system preference)
8. Onboarding polished with final copy and illustrations
9. Pull-to-refresh animations consistent across screens
10. Final design review with stakeholders before launch

---

### Story 8.6: App Store Preparation

**As a product owner,**
**I want** to prepare app store listings and marketing materials,
**so that** potential users understand WanderNote's value and download it.

**Acceptance Criteria:**
1. App Store (iOS) and Google Play (Android) developer accounts created
2. App metadata prepared: name, subtitle, description, keywords
3. App description highlights: "All-in-one travel companion", key features (planning, documentation, budget), privacy-first approach
4. Screenshots prepared: 6-8 screens showing key features on multiple device sizes
5. App preview video (30-60 seconds) demonstrating core flow: create trip → document → export
6. App icon finalized and exported in all required sizes
7. Privacy policy and terms of service published and linked
8. App Store Optimization (ASO): keywords researched for discoverability
9. Review submission checklist completed (no crashes, content policy compliance)
10. Soft launch plan: Release to small market first (e.g., New Zealand), gather feedback, then global rollout

---

### Story 8.7: Monitoring and Analytics Setup

**As a product owner,**
**I want** monitoring and analytics in place,
**so that** I can track app health, user behavior, and make data-informed decisions.

**Acceptance Criteria:**
1. Sentry integrated for crash reporting and error tracking
2. Analytics events tracked (privacy-respecting, no PII): app opened, trip created, note added, photo uploaded, expense logged, export triggered
3. Backend monitoring: API response times, error rates, database query performance
4. Uptime monitoring: Pingdom or similar service checks API health every 5 minutes
5. CloudWatch (or equivalent) dashboards for infrastructure metrics
6. Weekly automated reports: active users, trips created, exports generated, crashes
7. Alerts configured: API downtime, error rate spike, database connection issues
8. User retention cohort analysis: D1, D7, D30 retention rates
9. Feature adoption tracking: % of trips with documentation, % using budget tracking, % using export
10. Dashboard accessible to stakeholders for transparency

---

### Story 8.8: Production Deployment and Launch

**As a product owner,**
**I want** to deploy WanderNote to production and announce the public launch,
**so that** users can start using the app.

**Acceptance Criteria:**
1. Backend deployed to production infrastructure (AWS, Google Cloud, or equivalent)
2. Production database configured with backups (daily snapshots, 30-day retention)
3. SSL/TLS certificates configured for HTTPS API endpoints
4. CDN configured for media delivery (photos, voice memos)
5. Mobile apps submitted to App Store and Google Play for review
6. App Store review passed (typically 2-5 days)
7. Apps published and available for download in app stores
8. Launch announcement prepared: blog post, social media posts, product hunt submission
9. Support email (support@wandernote.app) and help documentation live
10. Post-launch monitoring: first 48 hours watched closely for crashes, server issues, user feedback

---

## Checklist Results Report

*To be completed: Execute pm-checklist after PRD review*

**Placeholder for Product Owner Master Checklist Results:**
- Requirements completeness validation
- Epic and story sequencing review
- Acceptance criteria quality check
- Dependency and blocker identification
- Technical feasibility validation
- MVP scope alignment verification

---

## Next Steps

### UX Expert Prompt

**"Review WanderNote PRD for UX/UI design. Create detailed design specifications including:**
- Screen-by-screen wireframes and mockups
- User flow diagrams for primary journeys (create trip → document → export)
- Design system (colors, typography, components)
- Interaction patterns and animations
- Accessibility guidelines (WCAG AA compliance)
- Responsive design specifications for various device sizes

**Use this PRD as the source of truth for functional requirements. Focus on creating an intuitive, calm, content-first mobile experience that encourages mindful travel planning and authentic documentation.**"

---

### Architect Prompt

**"Review WanderNote PRD and create comprehensive technical architecture. Define:**
- System architecture diagram (frontend, backend, database, external services)
- API specification (RESTful endpoints, request/response formats, authentication)
- Database schema (ERD with tables, relationships, indexes)
- Technology stack decisions (React Native, Spring Boot, PostgreSQL, AWS/GCP)
- Data flow for key features (real-time collaboration, offline sync, file uploads)
- Security architecture (authentication, authorization, encryption, API security)
- Deployment architecture (CI/CD, infrastructure, scaling strategy)
- Performance optimization strategy
- Testing approach (unit, integration, E2E)

**Use this PRD as the functional requirements reference. Ensure architecture supports MVP scope and provides foundation for Phase 2 expansion (offline-first sync, AI features, premium tier).**"

---

**Document Status:** ✅ **DRAFT COMPLETE - Ready for Review and Epic/Story Development**

---

*PRD created following BMAD™ methodology*
*Last updated: 2025-12-08*

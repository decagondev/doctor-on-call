# Product Requirements Document (PRD): Doctor On Call - Secure Online Medical Consultation Platform

## Executive Summary
Doctor On Call is a secure, user-friendly web platform that enables patients (clients) to discover, book, and conduct video consultations with verified doctors (consultants). An admin panel allows platform oversight.

**Key Objectives**:
- Provide accessible online healthcare consultations.
- Ensure data privacy and security compliant with best practices (HIPAA-aware design, though not certified).
- Deliver a modern, responsive UI with excellent performance and SEO.
- Scale reliably using Firebase services.

**Business Value**:
- Bridge gap between patients and doctors remotely.
- Monetization potential (future: payment integration for paid consultations).
- Low operational cost via serverless Firebase.

**Success Metrics**:
- User sign-ups and bookings.
- High retention via smooth video experience.
- Zero security breaches.

**Out of Scope (MVP)**:
- Payments, prescriptions, chat history persistence beyond appointments, mobile apps.

## User Stories
Organized by role.

### As a Client (Patient)
- US-01: I can sign up/login with email/password or Google so that I can access the platform.
- US-02: I can browse/search doctors by specialty, name, or availability.
- US-03: I can view a doctor's public profile (bio, specialty, ratings).
- US-04: I can book an available time slot and receive confirmation.
- US-05: I can join a video consultation at the scheduled time.
- US-06: I can view my upcoming/past appointments.
- US-07: I can edit my profile.

### As a Consultant (Doctor)
- US-08: I can sign up as a doctor (pending approval).
- US-09: I can complete my profile (specialty, bio, photo, qualifications).
- US-10: I can set recurring or one-off availability slots.
- US-11: I can view and manage my appointments.
- US-12: I can join video consultations.
- US-13: Once approved, my profile becomes visible to clients.

### As an Admin
- US-14: I can login and access the admin dashboard.
- US-15: I can view/list all users and approve/reject/ban doctors.
- US-16: I can view platform analytics (appointments, users).
- US-17: I can manage site settings (future).

### General
- US-18: The site is responsive, accessible, and SEO-optimized.
- US-19: All users receive basic email notifications (booking confirmation, reminders).

## Technical Summary
**Core Principles**: Strictly adhere to **SOLID** throughout:
- **Single Responsibility**: Each component/service handles one concern (e.g., AuthService only auth, BookingService only bookings).
- **Open-Closed**: Extend features via composition (e.g., new role checks without modifying existing rules).
- **Liskov Substitution**: Interfaces allow interchangeable implementations.
- **Interface Segregation**: Small, focused hooks/contexts (e.g., useAuth, useBooking).
- **Dependency Inversion**: Depend on abstractions (e.g., inject firebase services via modules).

**Architecture**:
- **Modular, Feature-Based Structure**:
  - `src/features/auth/`
  - `src/features/profile/`
  - `src/features/booking/`
  - `src/features/availability/`
  - `src/features/video/`
  - `src/features/admin/`
  - `src/features/dashboard/`
  - Each feature contains: components, hooks, services, types, routes.
- **Services Layer**: Granular Firebase interactions (authService.ts, firestoreService.ts, storageService.ts).
- **State Management**: React Context for auth/user, React Query or custom hooks for data fetching.
- **Routing**: React Router with protected routes (role-based).
- **Forms**: shadcn/ui + Zod validation.
- **Video**: Jitsi Meet External API (meet.jit.si public instance) embedded in iframe. Unique roomName per appointment (e.g., `doconcall-${appointmentId}-${timestamp}`).

**Security Approach** (Latest Best Practices - Dec 2025):
- **Authentication**: Firebase Auth (email/password + Google provider).
- **Roles**: Stored in Firestore `users/{uid}` document (role: 'client' | 'doctor' | 'admin', approved: boolean for doctors).
- **Authorization**: Primarily **Firestore Security Rules v2** with `get()` for role checks (least privilege, data validation, no client-side only enforcement).
- **Admin Actions**: Critical actions (approve doctor) via Cloud Functions (to avoid client-side admin privilege escalation).
- **Why Document-Based Roles (not Custom Claims)**: Easier management (admin can update directly), no token refresh issues, sufficient for this scale. Custom claims reserved if needed later for frequent checks.
- **Other**: Input validation (Zod), rate limiting via rules, no sensitive data exposure.

**Data Model** (Firestore Collections):
- `users/{uid}`: Private user data (role, email, name, createdAt, approved for doctors).
- `doctors/{uid}`: Public doctor profile (specialty, bio, photoURL, rating, qualifications).
- `availability/{doctorId}`: Subcollection of slots { start: timestamp, end: timestamp, booked: bool }.
- `appointments/{appointmentId}`: { clientId, doctorId, slotStart, slotEnd, status ('pending'|'confirmed'|'completed'|'cancelled'), roomName, notes }.

**Deployment**: Vercel/Netlify (existing config supports).

## Detailed Epics Roadmap
Phased for robust, incremental delivery. Each epic includes PRs, sample commits, subtasks, and SOLID alignment.

### Epic 0: Project Foundation & Cursor Configuration
Ensure consistent, secure development from day one.

**PR 0.1: Initialize Cursor Rules & Memory Bank**
- Commit 1: Add `.cursor/rules/project.rules.md`
- Commit 2: Add `.cursor/memory-bank/memory-bank.md`
- Subtasks:
  - Create directories.
  - Populate with detailed rules (SOLID enforcement, Firebase best practices, Jitsi usage, no Husky, Context7 MCP for docs).

**Updated project.rules.md Content** (robust):
```
# Cursor Rules for Doctor On Call

## Core Principles
- Strictly follow SOLID: Single responsibility, Open-closed (extend via composition), etc.
- Modular feature folders: src/features/<feature>/
- TypeScript strict: No 'any', explicit interfaces.
- Components: shadcn/ui only, minimal props (Interface Segregation).
- Services: Granular, injectable abstractions.

## Security
- Firestore rules v2: Validate all data (keys, types, sizes), least privilege.
- Role checks via get(/databases/$(database)/documents/users/$(request.auth.uid))
- Use functions for reusable conditions (isAuthenticated, isAdmin, isApprovedDoctor, ownsAppointment).
- Client-side validation with Zod, but never trust client.

## External APIs
- Always use Context7 MCP to fetch latest docs for Firebase, Jitsi, shadcn.
- Jitsi: Use external_api.js from meet.jit.si, dispose on unmount.

## Code Quality
- No Husky/pre-commit hooks.
- Clear algorithms with pseudocode for complex logic (e.g., slot overlap check).

## SEO/Polish
- Use existing SEO component.
- Static files in /public.
```

**PR 0.2: Minor Starter Enhancements**
- Add path aliases (@/*), verify React 19/Tailwind 4 compatibility.

### Epic 1: Firebase Setup & Authentication (SOLID: Dependency Inversion via services)
**PR 1.1: Firebase Initialization**
- Add firebase.ts, env vars, services/firebase.ts abstraction.

**PR 1.2: Auth Flows**
- features/auth: Signup/Login components, role selection on signup.
- AuthContext with user role loading.

**PR 1.3: Protected Routes**
- Role-based guards.

### Epic 2: Profiles & Role Management
**PR 2.1: Profile Components**
- Client/Doctor profile forms (Zod validation).

**PR 2.2: Doctor Approval Flow**
- Admin list + approve button (calls Cloud Function).

**PR 2.3: Initial Firestore Rules**
- Basic auth required, user doc ownership.

### Epic 3: Availability & Booking System
**PR 3.1: Doctor Availability UI**
- Calendar component (react-day-picker), save slots subcollection.

**PR 3.2: Doctor Discovery**
- Public doctors list (query approved doctors), search/filter.

**PR 3.3: Booking Algorithm**
- Client selects slot → atomic check (transaction or batched write): verify not booked → create appointment → mark slot booked.
- Pseudocode:
  ```
  function bookSlot(slotDoc, clientId):
    if slotDoc.booked: reject
    if slotDoc.start < now: reject
    create appointment doc
    update slot.booked = true
  ```

**PR 3.4: Dashboards**
- Client/Doctor appointment lists.

### Epic 4: Video Consultation (Jitsi Integration)
**PR 4.1: VideoRoom Component**
- Load external_api.js, new JitsiMeetExternalAPI({ domain: 'meet.jit.si', roomName, parentNode, userInfo: { displayName, email } }).
- Dispose api on unmount.
- Controls: mute, end call.

**PR 4.2: Join Logic**
- Only allow join within ±5 min of slot.
- Unique roomName for privacy.

### Epic 5: Security Hardening
**PR 5.1: Comprehensive Firestore Rules**
- rules_version = '2';
- Reusable functions: isClient(), isDoctor(), isApprovedDoctor(), isAdmin().
- Validate all writes (e.g., appointment create: slot exists && not booked && requester is client).
- Limit sizes (strings < 1000 chars).

**PR 5.2: Client Validation & Error Handling**
- Zod schemas everywhere.

**PR 5.3: Deploy Cloud Functions for Admin Actions**

### Epic 6: Notifications & UX Polish
**PR 6.1: Toast/Loading States**
**PR 6.2: Accessibility Audit**

### Epic 7: Admin Dashboard
**PR 7.1: Admin Routes & Components**
- User management table, analytics (aggregate queries).

### Epic 8: SEO, Sitemap, Robots.txt & RSS (Polishing)
**PR 8.1: Static SEO Files**
- public/robots.txt: Allow all, sitemap reference.
- public/sitemap.xml: Static routes + dynamic doctor profiles (generate at build if needed).

**PR 8.2: Dynamic SEO**
- Enhance existing SEO component for doctor pages (Open Graph images).

**PR 8.3: RSS Feed**
- public/rss.xml: Optional feed for platform updates or doctor blogs (static initial).

**PR 8.4: Lighthouse Optimization**

### Epic 9: Testing, Monitoring & Final Robustness
**PR 9.1: Tests (Vitest + RTL)**
- Unit for services, integration for flows.

**PR 9.2: Error Monitoring (Sentry optional)**
**PR 9.3: Production Deployment & Emulator Testing**

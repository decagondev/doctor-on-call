# Doctor On Call – Detailed Task List  
**Aligned with SOLID Principles & Granular Modular Design**  
**Date**: December 24, 2025  

This task list expands the PRD into an executable, highly granular roadmap. Every epic, PR, commit, and subtask is designed to enforce **SOLID** principles:

- **Single Responsibility**: Each module/component/service does one thing.
- **Open-Closed**: New features extend without modifying existing code (e.g., new role checks via composition).
- **Liskov Substitution**: Interfaces allow seamless swaps (e.g., mock services in tests).
- **Interface Segregation**: Small, focused hooks and props.
- **Dependency Inversion**: High-level modules depend on abstractions (e.g., injected firebase services).

Project structure will be strictly **feature-based** and **granular**:

```
src/
├── app/                  # Root layout, providers
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── routes/
│   ├── profile/
│   ├── availability/
│   ├── booking/
│   ├── video/
│   ├── dashboard/
│   └── admin/
├── lib/                  # Shared utilities (firebase init, zod schemas)
├── components/           # Global reusable UI (SEO, Layout, etc.)
└── types/                # Global types
```

### Epic 0: Project Foundation & Development Alignment
**Goal**: Establish consistent, secure, SOLID-compliant development environment.

#### PR 0.1: Create Cursor Configuration Directory & Rules
**Commits**:
1. feat(cursor): add .cursor/rules directory and project.rules.md
2. feat(cursor): add .cursor/memory-bank directory and initial memory-bank.md

**Subtasks**:
- 0.1.1 Create folder `.cursor/rules` at project root.
- 0.1.2 Create `project.rules.md` with comprehensive rules covering:
  - Mandatory SOLID adherence per file/component.
  - Feature-folder structure enforcement.
  - TypeScript strictness (no `any`, explicit returns).
  - Firebase security best practices (rules v2, validation, least privilege).
  - Jitsi integration guidelines.
  - Context7 MCP usage for external docs.
  - Ban on Husky/pre-commit hooks.
- 0.1.3 Create folder `.cursor/memory-bank`.
- 0.1.4 Create `memory-bank.md` and document:
  - Project overview, tech decisions, epic progress tracker.

#### PR 0.2: Verify & Enhance Starter Repo
**Commits**:
1. chore: verify starter runs and update dependencies if needed
2. chore: add path aliases and minor cleanups

**Subtasks**:
- 0.2.1 Clone repo and run `npm install && npm run dev` – confirm no errors.
- 0.2.2 Update all dependencies to latest compatible versions (React 19, Tailwind 4, shadcn latest).
- 0.2.3 Add `@/*` path alias in `tsconfig.json` and `vite.config.ts`.
- 0.2.4 Ensure existing SEO component is reusable across features.

### Epic 1: Firebase Integration & Authentication
**Goal**: Secure auth with role awareness, fully abstracted services.

#### PR 1.1: Firebase Project Setup & Client Initialization
**Commits**:
1. feat(firebase): add config and initialization
2. feat(firebase): create abstracted firebase service module

**Subtasks**:
- 1.1.1 Create Firebase project, enable Auth (Email/Password + Google) and Firestore.
- 1.1.2 Add `.env.local` with `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.
- 1.1.3 Create `src/lib/firebase.ts` → initializeApp + exports for auth, db, storage.
- 1.1.4 Create `src/lib/services/firebaseService.ts` abstraction (getAuth(), getFirestore() wrappers for DI/testing).

#### PR 1.2: Authentication UI & Flows
**Commits**:
1. feat(auth): add Login and Signup components
2. feat(auth): add role selection on first signup
3. feat(auth): create AuthContext with role loading

**Subtasks**:
- 1.2.1 Create `src/features/auth/components/LoginForm.tsx` (shadcn form + Zod).
- 1.2.2 Create `src/features/auth/components/SignupForm.tsx`.
- 1.2.3 Create `src/features/auth/components/RoleSelectionDialog.tsx` (triggers after signup if no role).
- 1.2.4 Create `src/features/auth/services/authService.ts`:
  - Functions: signUp(email, password, role), signIn(), signOut(), googleSignIn().
  - After signup → create user doc in `users/{uid}` with role and approved: false for doctors.
- 1.2.5 Create `src/features/auth/hooks/useAuth.ts` → returns user, role, loading.
- 1.2.6 Create `AuthProvider` in `src/app/providers.tsx`.

#### PR 1.3: Protected Routes & Role Guards
**Commits**:
1. feat(auth): add role-based route protection

**Subtasks**:
- 1.3.1 Create `src/features/auth/components/ProtectedRoute.tsx` (checks auth + optional roles).
- 1.3.2 Create route groups: public, client-only, doctor-only, admin-only.
- 1.3.3 Update `src/app/routes.tsx` to use guards.

### Epic 2: User Profiles & Role Management
**Goal**: Granular profile management with approval workflow.

#### PR 2.1: Profile Editing Components
**Commits**:
1. feat(profile): add client profile page and edit form
2. feat(profile): add doctor profile page and extended form

**Subtasks**:
- 2.1.1 Create `src/features/profile/types.ts` (shared + doctor-specific fields).
- 2.1.2 Create `src/features/profile/components/ProfileForm.tsx` (Zod schema per role).
- 2.1.3 Create `src/features/profile/services/profileService.ts` (update user doc + doctor doc).
- 2.1.4 Photo upload using Firebase Storage (optional progress bar).

#### PR 2.2: Admin User Management
**Commits**:
1. feat(admin): add users list and approval controls

**Subtasks**:
- 2.2.1 Create `src/features/admin/components/UserTable.tsx`.
- 2.2.2 Create `src/features/admin/services/adminService.ts` (Cloud Function calls for approve/ban).
- 2.2.3 Implement approve button → updates `users/{uid}.approved = true`.

#### PR 2.3: Initial Firestore Security Rules
**Commits**:
1. security: add basic firestore.rules with ownership

**Subtasks**:
- 2.3.1 Create `firestore.rules`.
- 2.3.2 Implement:
  - require auth for all operations.
  - `users/{uid}` readable/writable only by owner or admin.
  - Role field immutable after creation except by admin.

### Epic 3: Doctor Availability & Booking System
**Goal**: Robust slot management and atomic booking.

#### PR 3.1: Doctor Availability Management
**Commits**:
1. feat(availability): add calendar UI for doctors
2. feat(availability): add slot CRUD service

**Subtasks**:
- 3.1.1 Choose library: `react-day-picker` or `@fullcalendar/react`.
- 3.1.2 Create `src/features/availability/components/AvailabilityCalendar.tsx`.
- 3.1.3 Slots stored as subcollection `availability/{doctorId}/{slotId}`.
- 3.1.4 Service: createSlot(), deleteSlot(), listSlots().

#### PR 3.2: Public Doctor Discovery
**Commits**:
1. feat(booking): add doctors browse page with filters

**Subtasks**:
- 3.2.1 Create `src/features/booking/components/DoctorsList.tsx`.
- 3.2.2 Query only approved doctors (`where('approved', '==', true)`).
- 3.2.3 Filters: specialty, name search, upcoming availability.

#### PR 3.3: Booking Flow & Atomic Reservation
**Commits**:
1. feat(booking): implement slot selection and booking
2. feat(booking): add transactional booking logic

**Subtasks**:
- 3.3.1 Create booking wizard (select doctor → select slot → confirm).
- 3.3.2 Use Firestore transaction:
  ```
  runTransaction(async (tx) => {
    const slotSnap = await tx.get(slotRef);
    if (slotSnap.data().booked) throw "Slot taken";
    tx.update(slotRef, { booked: true });
    tx.set(appointmentRef, { ...data });
  })
  ```
- 3.3.3 Generate unique `roomName = doconcall-${appointmentId}`.

#### PR 3.4: Appointment Dashboards
**Commits**:
1. feat(dashboard): add client and doctor appointment views

**Subtasks**:
- 3.4.1 Create shared `AppointmentCard` and `AppointmentList`.
- 3.4.2 Separate routes: `/dashboard/client`, `/dashboard/doctor`.

### Epic 4: Video Consultation Integration (Jitsi)
**Goal**: Secure, disposable video rooms.

#### PR 4.1: Jitsi Video Room Component
**Commits**:
1. feat(video): create reusable JitsiRoom component

**Subtasks**:
- 4.1.1 Load `https://meet.jit.si/external_api.js` dynamically.
- 4.1.2 Create `src/features/video/components/JitsiRoom.tsx`.
- 4.1.3 Options: roomName, userInfo { displayName, email }, interfaceConfigOverwrite.
- 4.1.4 Cleanup: api.dispose() on unmount.

#### PR 4.2: Integrate Video into Appointment Flow
**Commits**:
1. feat(booking): add "Join Consultation" button with time guard

**Subtasks**:
- 4.2.1 Only enable join ±10 minutes from slot start.
- 4.2.2 Redirect to dedicated `/consultation/{appointmentId}` page with JitsiRoom.

### Epic 5: Comprehensive Security Hardening
#### PR 5.1: Full Firestore Security Rules v2
**Commits**:
1. security(rules): implement complete rules with validation functions

**Subtasks**:
- 5.1.1 Define reusable functions: isAuthenticated(), isClient(), isApprovedDoctor(), isAdmin(), ownsAppointment().
- 5.1.2 Validate all fields (types, sizes, allowed values).
- 5.1.3 Slot booking: check requester is client && slot not booked.
- 5.1.4 Test rules locally with Firebase emulator.

#### PR 5.2: Client-Side Validation & Error Handling
**Commits**:
1. feat(validation): add Zod schemas across features

**Subtasks**:
- 5.2.1 Centralize schemas in `src/lib/validation/`.
- 5.2.2 Global error boundary and toast notifications.

### Epic 6: UX Polish & Notifications
**Subtasks**:
- Loading skeletons, responsive breakpoints.
- Email notifications via Firebase Extensions (booking confirmation).

### Epic 7: Admin Dashboard
**Subtasks**:
- Analytics cards (total users, bookings).
- User management table with pagination.

### Epic 8: SEO, Sitemap, Robots.txt & RSS
#### PR 8.1: Static SEO Assets
**Subtasks**:
- Create `public/robots.txt`.
- Create `public/sitemap.xml` with core routes.

#### PR 8.2: Dynamic SEO for Doctor Profiles
**Subtasks**:
- Enhance existing SEO component to accept dynamic title/description/image per doctor page.

#### PR 8.3: RSS Feed
**Subtasks**:
- Create `public/rss.xml` (static initial, later dynamic for blog if added).

### Epic 9: Testing, Monitoring & Deployment
**Subtasks**:
- Vitest unit tests for services.
- RTL integration tests for critical flows.
- Vercel/Netlify deployment config.
- Lighthouse >90 score target.

This granular task list ensures every change is small, testable, and aligned with SOLID principles for long-term maintainability. Begin with **Epic 0** to lock in standards before any code.

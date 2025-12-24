# Doctor On Call - Secure Online Medical Consultation Platform

A secure, user-friendly web platform that enables patients (clients) to discover, book, and conduct video consultations with verified doctors (consultants). Built with React 19, TypeScript, Vite, Firebase, and Jitsi Meet. Designed with SOLID principles, modular architecture, and security best practices.

## ✨ Features

- ⚡ **Vite** - Lightning-fast development and build
- ⚛️ **React 19** - Latest React with TypeScript
- 🎨 **ShadCN UI** - Beautiful, accessible component library
- 🎭 **Tailwind CSS 4** - Modern utility-first CSS
- 🔥 **Firebase** - Authentication, Firestore, Storage, Cloud Functions
- 📹 **Jitsi Meet** - Secure video consultations
- 🌙 **Dark Mode** - Built-in theme toggle (defaults to dark)
- 📱 **Responsive** - Mobile-first design with collapsible sidebar
- 🔍 **SEO Ready** - Dynamic metadata management per page
- 🧭 **React Router** - Client-side routing with role-based protection
- 🚀 **Netlify Ready** - Pre-configured for Netlify deployment
- 🏗️ **SOLID Principles** - Clean, modular, maintainable code
- 🔒 **Security First** - Firestore Security Rules v2, input validation, least privilege
- 📄 **Legal Pages** - Privacy Policy and Terms of Service templates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd doctor-on-call

# Install dependencies
npm install

# Create .env.local file with Firebase configuration
# See docs/SETUP.md for details

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your application.

**Note**: Firebase configuration is required. See [Setup Guide](./docs/SETUP.md) for detailed instructions.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Navbar, Sidebar, Footer, Layout
│   ├── seo/            # SEO component for metadata
│   └── ui/             # ShadCN UI components
├── config/             # Application configuration
├── contexts/           # React contexts (Theme)
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── AboutPage.tsx
│   ├── PrivacyPolicyPage.tsx
│   └── TermsOfServicePage.tsx
├── App.tsx             # Main app with routing
└── main.tsx            # Application entry point
```

## 🎨 Customization

### Branding

1. **Update app configuration** (`src/config/app.config.ts`):
   ```typescript
   export const appConfig = {
     name: "Your Application",
     companyName: "Your Company",
     // ... other config
   }
   ```

2. **Update navbar branding** (`src/components/layout/Navbar.tsx`):
   - Change "YourApp" to your app name

3. **Customize landing page** (`src/pages/LandingPage.tsx`):
   - Update hero content, features, and CTAs

### Theme

- Defaults to dark mode
- Theme preference stored in localStorage
- Toggle available in navbar
- Customize colors in `src/index.css` (CSS variables)

### SEO

Each page uses the `SEO` component:

```tsx
import { SEO } from "@/components/seo/SEO"

<SEO
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
  ogImage="/og-image.png"
/>
```

### Adding Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation links in `Navbar.tsx` and `Sidebar.tsx`

## 📚 Documentation

- **[Product Requirements Document](./docs/PRD.md)** - Complete product requirements and architecture
- **[Task List](./docs/TASKLIST.md)** - Detailed development roadmap
- **[Architecture Diagrams](./docs/DIAGRAMS.md)** - System architecture and data flow diagrams
- **[Setup Guide](./docs/SETUP.md)** - Detailed setup and customization instructions
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Netlify deployment instructions

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Architecture

This project follows **SOLID principles** and a **feature-based modular structure**:

- **Single Responsibility**: Each component/service has one clear purpose
- **Open/Closed**: Extend via composition, not modification
- **Liskov Substitution**: Interfaces allow interchangeable implementations
- **Interface Segregation**: Small, focused hooks/props
- **Dependency Inversion**: Depend on abstractions (injected Firebase services)

### Feature Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   ├── profile/       # User profiles
│   ├── availability/  # Doctor availability
│   ├── booking/       # Appointment booking
│   ├── video/         # Video consultations
│   ├── dashboard/     # User dashboards
│   └── admin/         # Admin panel
├── components/        # Global reusable components
├── lib/              # Shared utilities
└── config/           # Application configuration
```

See [PRD.md](./docs/PRD.md) for detailed architecture documentation.

## 🚢 Deployment

### Netlify

The template is pre-configured for Netlify deployment:

1. **Manual Deployment**:
   ```bash
   npm run build
   # Drag and drop dist/ folder to Netlify
   ```

2. **Git Integration**:
   - Connect your repository to Netlify
   - Build settings are auto-detected from `netlify.toml`

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 🎯 Key Components

### Layout Components

- **Navbar**: Sticky navigation with theme toggle
- **Sidebar**: Collapsible mobile navigation
- **Footer**: Templatable footer with legal links
- **Layout**: Composes all layout components

### SEO Component

Modular SEO component that updates:
- Page title
- Meta description
- Open Graph tags
- Twitter Card tags
- Canonical URLs

### Theme Context

Manages dark/light mode:
- Defaults to dark mode
- Persists preference in localStorage
- Provides toggle function

## 📝 License

This is a starter template. Customize it for your project.

## 🤝 Contributing

This is a starter template. Feel free to fork and customize for your needs.

## 📖 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [ShadCN UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

---

Built with ❤️ using modern web technologies
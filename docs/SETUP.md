# Setup Instructions

This guide will help you get started with the React TypeScript Vite ShadCN Tailwind 4 starter template.

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- A code editor (VS Code recommended)

## Installation

1. **Clone or download this template**

   ```bash
   git clone <repository-url>
   cd react-ts-vite-shadcn-tw4-starter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   ├── seo/            # SEO component for metadata management
│   └── ui/             # ShadCN UI components
├── config/             # Application configuration
├── contexts/           # React contexts (Theme, etc.)
├── lib/                # Utility functions
├── pages/              # Page components
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## Customization

### Branding

1. **Update app configuration** (`src/config/app.config.ts`):
   - Change `name` and `companyName`
   - Update `description` and `baseUrl`
   - Customize footer links

2. **Update branding in components**:
   - Navbar: Update "YourApp" text in `src/components/layout/Navbar.tsx`
   - Landing page: Customize content in `src/pages/LandingPage.tsx`

### Theme

The application defaults to dark mode. Theme preferences are stored in localStorage.

- Theme toggle is available in the navbar
- Customize colors in `src/index.css` (CSS variables)

### SEO

Each page uses the `SEO` component for dynamic metadata:

```tsx
import { SEO } from "@/components/seo/SEO"

<SEO
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
/>
```

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add route in `src/App.tsx`:

```tsx
<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation link in:
   - `src/components/layout/Navbar.tsx` (desktop)
   - `src/components/layout/Sidebar.tsx` (mobile)

### Legal Pages

Update the content in:
- `src/pages/PrivacyPolicyPage.tsx`
- `src/pages/TermsOfServicePage.tsx`

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_BASE_URL=https://yourdomain.com
```

## Next Steps

- Customize the branding and content
- Add your own pages and components
- Update legal pages (Privacy Policy, Terms of Service)
- Configure SEO metadata for each page
- Set up your deployment pipeline
/**
 * Application configuration
 * Centralized configuration following Single Responsibility Principle
 * Easy to customize for different projects
 */
export const appConfig = {
  name: "Your Application",
  companyName: "Your Company",
  description:
    "A modern starter template for React applications with TypeScript, Vite, ShadCN UI, and Tailwind CSS 4",
  baseUrl: import.meta.env.VITE_BASE_URL || "https://yourdomain.com",
  footer: {
    companyName: "Your Company",
    year: new Date().getFullYear(),
    links: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
    ],
    showPrivacyPolicy: true,
    showTermsOfService: true,
  },
} as const

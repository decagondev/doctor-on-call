import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppProviders } from "@/app/providers"
import { Layout } from "@/components/layout/Layout"
import { LandingPage } from "@/pages/LandingPage"
import { AboutPage } from "@/pages/AboutPage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage"
import { TermsOfServicePage } from "@/pages/TermsOfServicePage"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { SignupPage } from "@/features/auth/pages/SignupPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProfilePage } from "@/features/profile/pages/ProfilePage"
import { AdminPage } from "@/features/admin/pages/AdminPage"
import { appConfig } from "@/config/app.config"

/**
 * Main App component
 * Follows Dependency Inversion Principle - depends on abstractions (routes, config)
 */
function App() {
  return (
    <ThemeProvider>
      <AppProviders>
        <BrowserRouter>
          <Layout footerConfig={appConfig.footer}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProviders>
    </ThemeProvider>
  )
}

export default App
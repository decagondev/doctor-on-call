import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Layout } from "@/components/layout/Layout"
import { LandingPage } from "@/pages/LandingPage"
import { AboutPage } from "@/pages/AboutPage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage"
import { TermsOfServicePage } from "@/pages/TermsOfServicePage"
import { appConfig } from "@/config/app.config"

/**
 * Main App component
 * Follows Dependency Inversion Principle - depends on abstractions (routes, config)
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout footerConfig={appConfig.footer}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
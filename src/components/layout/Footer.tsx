import { Link } from "react-router-dom"

export interface FooterConfig {
  companyName?: string
  year?: number
  links?: ReadonlyArray<{ readonly label: string; readonly path: string }> | Array<{ label: string; path: string }>
  showPrivacyPolicy?: boolean
  showTermsOfService?: boolean
}

interface FooterProps {
  config?: FooterConfig
}

/**
 * Footer component with templatable content
 * Follows Dependency Inversion Principle - depends on config abstraction
 */
export function Footer({
  config = {
    companyName: "Your Company",
    year: new Date().getFullYear(),
    links: [],
    showPrivacyPolicy: true,
    showTermsOfService: true,
  },
}: FooterProps) {
  const {
    companyName,
    year,
    links = [],
    showPrivacyPolicy,
    showTermsOfService,
  } = config

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-2">
            <h3 className="font-semibold">{companyName}</h3>
            <p className="text-sm text-muted-foreground">
              © {year} {companyName}. All rights reserved.
            </p>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Links</h4>
              <ul className="space-y-1 text-sm">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Links */}
          <div className="space-y-2">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-1 text-sm">
              {showPrivacyPolicy && (
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              )}
              {showTermsOfService && (
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Get in touch with us
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

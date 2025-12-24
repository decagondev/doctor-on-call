import { SEO } from "@/components/seo/SEO"

/**
 * Terms of Service page - templatable content
 */
export function TermsOfServicePage() {
  return (
    <>
      <SEO
        title="Terms of Service - React TypeScript Vite Starter"
        description="Terms of Service for this application"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold">Terms of Service</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-muted-foreground">
              This is a template terms of service. Please update this content to
              reflect your actual terms and legal requirements.
            </p>
            <h2 className="mt-8 text-2xl font-semibold">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              [Describe the acceptance of terms]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">Use License</h2>
            <p className="text-muted-foreground">
              [Describe the use license and restrictions]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">User Accounts</h2>
            <p className="text-muted-foreground">
              [Describe user account requirements and responsibilities]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              [Describe limitation of liability]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact
              us at [your-email@example.com]
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

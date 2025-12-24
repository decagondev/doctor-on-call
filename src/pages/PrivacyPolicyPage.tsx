import { SEO } from "@/components/seo/SEO"

/**
 * Privacy Policy page - templatable content
 */
export function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy - React TypeScript Vite Starter"
        description="Privacy Policy for this application"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-muted-foreground">
              This is a template privacy policy. Please update this content to
              reflect your actual privacy practices and legal requirements.
            </p>
            <h2 className="mt-8 text-2xl font-semibold">
              Information We Collect
            </h2>
            <p className="text-muted-foreground">
              [Describe what information you collect and how you collect it]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">How We Use Information</h2>
            <p className="text-muted-foreground">
              [Describe how you use the collected information]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground">
              [Describe your data security measures]
            </p>
            <h2 className="mt-8 text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us
              at [your-email@example.com]
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

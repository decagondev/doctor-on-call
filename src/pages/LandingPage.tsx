import { SEO } from "@/components/seo/SEO"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

/**
 * Landing page component with neutral branding
 * Easy to rebrand by updating content
 */
export function LandingPage() {
  return (
    <>
      <SEO
        title="Welcome - React TypeScript Vite Starter"
        description="A modern, production-ready starter template for building React applications"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Your Application
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            A modern starter template built with React, TypeScript, Vite, ShadCN
            UI, and Tailwind CSS 4. Ready to customize and deploy.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/about">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Fast Development</h3>
              <p className="text-muted-foreground">
                Built with Vite for lightning-fast development and hot module
                replacement.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Type Safe</h3>
              <p className="text-muted-foreground">
                Full TypeScript support for better developer experience and
                fewer bugs.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Modern UI</h3>
              <p className="text-muted-foreground">
                Beautiful components with ShadCN UI and Tailwind CSS 4.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { SEO } from "@/components/seo/SEO"

/**
 * About page component
 */
export function AboutPage() {
  return (
    <>
      <SEO
        title="About - React TypeScript Vite Starter"
        description="Learn more about this starter template"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold">About</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              This is a modern starter template for building React applications
              with TypeScript, Vite, ShadCN UI, and Tailwind CSS 4.
            </p>
            <p className="text-muted-foreground">
              The template follows SOLID principles and is designed to be
              modular, extensible, and easy to customize. It includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Dark mode support with theme toggle</li>
              <li>Responsive navigation with sticky navbar</li>
              <li>Collapsible sidebar for mobile</li>
              <li>SEO component for dynamic metadata</li>
              <li>Footer with legal pages</li>
              <li>React Router DOM for routing</li>
              <li>Netlify deployment ready</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

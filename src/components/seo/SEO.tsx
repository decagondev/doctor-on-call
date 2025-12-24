import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  author?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  canonical?: string
}

/**
 * SEO component that dynamically updates page metadata
 * Follows Single Responsibility Principle - only handles SEO metadata
 */
export function SEO({
  title = "React TypeScript Vite Starter",
  description = "A modern starter template for React applications with TypeScript, Vite, ShadCN UI, and Tailwind CSS 4",
  keywords = "react, typescript, vite, shadcn, tailwind",
  author = "Your Company",
  ogImage = "/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonical,
}: SEOProps) {
  const location = useLocation()
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin
  const fullCanonical = canonical || `${baseUrl}${location.pathname}`

  useEffect(() => {
    // Update title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement("meta")
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute("content", content)
    }

    // Standard meta tags
    updateMetaTag("description", description)
    updateMetaTag("keywords", keywords)
    updateMetaTag("author", author)

    // Open Graph tags
    updateMetaTag("og:title", title, "property")
    updateMetaTag("og:description", description, "property")
    updateMetaTag("og:image", ogImage, "property")
    updateMetaTag("og:type", ogType, "property")
    updateMetaTag("og:url", fullCanonical, "property")

    // Twitter Card tags
    updateMetaTag("twitter:card", twitterCard)
    updateMetaTag("twitter:title", title)
    updateMetaTag("twitter:description", description)
    updateMetaTag("twitter:image", ogImage)

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement("link")
      canonicalLink.setAttribute("rel", "canonical")
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute("href", fullCanonical)
  }, [title, description, keywords, author, ogImage, ogType, twitterCard, fullCanonical, location.pathname])

  return null
}

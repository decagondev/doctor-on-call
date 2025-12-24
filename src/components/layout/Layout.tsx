import { useState, type ReactNode } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { Footer, type FooterConfig } from "./Footer"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: ReactNode
  footerConfig?: FooterConfig
}

/**
 * Main layout component that composes navbar, sidebar, and footer
 * Follows Composition over Inheritance principle
 */
export function Layout({ children, footerConfig }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <main
        className={cn(
          "flex-1 transition-all duration-300 pt-0",
          sidebarOpen ? "ml-64" : "ml-12"
        )}
      >
        {children}
      </main>
      <Footer config={footerConfig} />
    </div>
  )
}

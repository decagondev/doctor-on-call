import { Link, useLocation } from "react-router-dom"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

/**
 * Collapsible sidebar component with chevron toggle
 * Follows Single Responsibility Principle - handles sidebar navigation only
 */
export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/about", label: "About", icon: "ℹ️" },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-12"
        )}
      >
        {/* Chevron Toggle Button - on the right edge */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {/* Sidebar Content */}
        <div className={cn("h-full overflow-hidden transition-all", isOpen ? "opacity-100" : "opacity-0")}>
          <div className="flex h-16 items-center border-b px-4">
            <span className="font-semibold">Menu</span>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onToggle()
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span>{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Collapsed Icon View */}
        {!isOpen && (
          <div className="flex flex-col gap-2 p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-center rounded-md p-2 text-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={item.label}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}

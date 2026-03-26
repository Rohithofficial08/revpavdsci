import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import { Shield, Upload, BarChart3, AlertTriangle, GitBranch, FileText, Home } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
  analysisId?: string
}

export default function Layout({ children, analysisId }: LayoutProps) {
  const router = useRouter()

  const navItems = analysisId
    ? [
        { href: `/analysis/${analysisId}`, label: "Dashboard", icon: BarChart3 },
        { href: `/analysis/${analysisId}/findings`, label: "Findings", icon: AlertTriangle },
        { href: `/analysis/${analysisId}/chains`, label: "Attack Chains", icon: GitBranch },
        { href: `/analysis/${analysisId}/summary`, label: "Summary", icon: FileText },
      ]
    : []

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2 mr-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AI Cyber Forensics</span>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent",
                router.pathname === "/" && "bg-accent"
              )}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent",
                  router.pathname === item.href && "bg-accent"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-6">{children}</main>
    </div>
  )
}

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Upload,
  BarChart3,
  AlertTriangle,
  GitBranch,
  FileText,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Lock,
  Eye,
} from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { cn } from "@/lib/utils"

interface SidebarProps {
  analysisId?: string
  collapsed: boolean
  onToggle: () => void
}

const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 72 },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export default function Sidebar({ analysisId, collapsed, onToggle }: SidebarProps) {
  const router = useRouter()

  const mainNavItems = [
    { href: "/", label: "Dashboard", icon: Home },
  ]

  const analysisNavItems = analysisId
    ? [
        { href: `/analysis/${analysisId}`, label: "Overview", icon: BarChart3 },
        { href: `/analysis/${analysisId}/findings`, label: "Findings", icon: AlertTriangle },
        { href: `/analysis/${analysisId}/chains`, label: "Attack Chains", icon: GitBranch },
        { href: `/analysis/${analysisId}/summary`, label: "AI Summary", icon: FileText },
      ]
    : []

  const isActive = (href: string) => router.pathname === href

  return (
    <motion.aside
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 flex items-center justify-center" style={{ borderRadius: "6px" }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold text-white text-sm">Cyber Forensics</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {/* Main Section */}
        <div className="mb-6">
          {!collapsed && (
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2 block">
              Main
            </span>
          )}
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 group",
                    isActive(item.href)
                      ? "text-white"
                      : "text-zinc-400"
                  )}
                  style={{
                    borderRadius: "6px",
                    backgroundColor: isActive(item.href) ? "#3b3486" : undefined,
                    color: isActive(item.href) ? "#ffffff" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = "#3b3486"
                      e.currentTarget.style.color = "#ffffff"
                      e.currentTarget.querySelectorAll("span, svg").forEach(el => {
                        (el as HTMLElement).style.color = "#ffffff"
                      })
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = ""
                      e.currentTarget.style.color = ""
                      e.currentTarget.querySelectorAll("span, svg").forEach(el => {
                        (el as HTMLElement).style.color = ""
                      })
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Analysis Section */}
        {analysisNavItems.length > 0 && (
          <div className="mb-6">
            {!collapsed && (
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2 block">
                Analysis
              </span>
            )}
            <ul className="space-y-1">
              {analysisNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150",
                      isActive(item.href)
                        ? "text-white"
                        : "text-zinc-400"
                    )}
                    style={{
                      borderRadius: "6px",
                      backgroundColor: isActive(item.href) ? "#3b3486" : undefined,
                      color: isActive(item.href) ? "#ffffff" : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.href)) {
                        e.currentTarget.style.backgroundColor = "#3b3486"
                        e.currentTarget.style.color = "#ffffff"
                        e.currentTarget.querySelectorAll("span, svg").forEach(el => {
                          (el as HTMLElement).style.color = "#ffffff"
                        })
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.href)) {
                        e.currentTarget.style.backgroundColor = ""
                        e.currentTarget.style.color = ""
                        e.currentTarget.querySelectorAll("span, svg").forEach(el => {
                          (el as HTMLElement).style.color = ""
                        })
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800 space-y-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors duration-150"
          style={{ borderRadius: "6px" }}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}

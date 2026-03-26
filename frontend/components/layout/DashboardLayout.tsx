import React, { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  analysisId?: string
}

export default function DashboardLayout({ children, analysisId }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar
        analysisId={analysisId}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 260,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="min-h-screen"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

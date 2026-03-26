import React from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeContext"
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 flex items-center transition-colors duration-200",
        theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
      )}
      style={{ borderRadius: "6px" }}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute w-5 h-5 flex items-center justify-center",
          theme === "dark"
            ? "left-1 bg-zinc-900"
            : "right-1 bg-white"
        )}
        style={{ borderRadius: "4px" }}
      >
        {theme === "dark" ? (
          <Moon className="w-3 h-3 text-zinc-400" />
        ) : (
          <Sun className="w-3 h-3 text-[#3b3486]" />
        )}
      </motion.div>
    </button>
  )
}

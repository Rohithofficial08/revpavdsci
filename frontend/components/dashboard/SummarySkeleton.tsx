import React from "react"
import { motion } from "framer-motion"

function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-zinc-800 ${className}`}
      style={{ borderRadius: "6px" }}
    />
  )
}

export default function SummaryPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10" />
          <div className="space-y-2">
            <Skeleton className="w-28 h-5" />
            <Skeleton className="w-40 h-3" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-28 h-9" />
          <Skeleton className="w-24 h-9" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>

      {/* Executive summary skeleton */}
      <Skeleton className="h-32" />

      {/* Split view skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {/* Main content */}
        <div className="col-span-2 space-y-4">
          <Skeleton className="h-10" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  )
}

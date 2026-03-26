import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn("bg-zinc-800", className)}
      style={{ borderRadius: "6px" }}
    />
  )
}

export function FindingCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4" style={{ borderRadius: "6px" }}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-16 h-5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-4" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <Skeleton className="w-6 h-6" />
      </div>
    </div>
  )
}

export function StatsBarSkeleton() {
  return (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="flex-1 h-16" />
      ))}
    </div>
  )
}

export function FindingsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-48 h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-28 h-9" />
          <Skeleton className="w-28 h-9" />
        </div>
      </div>

      {/* Stats skeleton */}
      <StatsBarSkeleton />

      {/* Findings skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <FindingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

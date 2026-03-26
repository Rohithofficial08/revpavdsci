import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ChainCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4" style={{ borderRadius: "6px" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 h-4 bg-zinc-800"
            style={{ borderRadius: "4px" }}
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-20 h-4 bg-zinc-800"
            style={{ borderRadius: "4px" }}
          />
        </div>
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-5 bg-zinc-800"
          style={{ borderRadius: "4px" }}
        />
      </div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="w-12 h-4 bg-zinc-800"
            style={{ borderRadius: "3px" }}
          />
        ))}
      </div>
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-1 bg-zinc-800"
        style={{ borderRadius: "2px" }}
      />
    </div>
  )
}

export function ChainDetailSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 h-full p-4" style={{ borderRadius: "6px" }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-24 h-5 bg-zinc-800"
            style={{ borderRadius: "4px" }}
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-20 h-5 bg-zinc-800"
            style={{ borderRadius: "4px" }}
          />
        </div>

        {/* Content blocks */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-16 h-3 bg-zinc-800"
              style={{ borderRadius: "4px" }}
            />
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-full h-16 bg-zinc-800"
              style={{ borderRadius: "6px" }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChainsPageSkeleton() {
  return (
    <div className="h-[calc(100vh-120px)]">
      {/* Stats skeleton */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="h-20 bg-zinc-900 border border-zinc-800"
            style={{ borderRadius: "6px" }}
          />
        ))}
      </div>

      {/* Split view skeleton */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-100px)]">
        <div className="space-y-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <ChainCardSkeleton key={i} />
          ))}
        </div>
        <ChainDetailSkeleton />
      </div>
    </div>
  )
}

import React from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { BarChart3, PieChart as PieIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChartsProps {
  severityData: { name: string; value: number; color: string }[]
  typeData: { name: string; value: number }[]
  timelineData?: { time: string; count: number }[]
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#3b3486",
  High: "#10b981",
  Medium: "#f8883f",
  Low: "#3b82f6",
  Info: "#6b7280",
}

const TYPE_COLORS = ["#3b82f6", "#8b5cf6", "#ef4444", "#10b981"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 px-3 py-2" style={{ borderRadius: "6px" }}>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-semibold text-white">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function Charts({ severityData, typeData, timelineData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Severity Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-zinc-900 border border-zinc-800 p-4"
        style={{ borderRadius: "6px" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Findings by Severity</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={severityData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#71717a" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#71717a" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {severityData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Type Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-zinc-900 border border-zinc-800 p-4"
        style={{ borderRadius: "6px" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Detection Types</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              stroke="none"
            >
              {typeData.map((entry, index) => (
                <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {typeData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2"
                style={{
                  backgroundColor: TYPE_COLORS[index % TYPE_COLORS.length],
                  borderRadius: "2px",
                }}
              />
              <span className="text-[10px] text-zinc-400">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Chart */}
      {timelineData && timelineData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-zinc-900 border border-zinc-800 p-4 lg:col-span-2"
          style={{ borderRadius: "6px" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Activity Timeline</h3>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  )
}

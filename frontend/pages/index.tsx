import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/DashboardLayout"
import UploadZone from "@/components/dashboard/UploadZone"
import { CheckCircle, XCircle, Loader2, Trash2, BarChart3, AlertTriangle } from "lucide-react"
import { uploadFile, apiFetch, connectWebSocket } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Analysis {
  id: string
  filename: string
  file_size_bytes: number
  status: string
  progress: number
  total_events: number
  total_findings: number
  risk_score: number
  created_at: string
}

export default function HomePage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = async () => {
    try {
      const data = await apiFetch("/api/v1/analyses")
      setAnalyses(data.data || [])
    } catch (err) {
      console.error("Failed to load analyses:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadFile(file)

      const ws = connectWebSocket(result.id, (msg) => {
        if (msg.type === "progress") {
          setUploadProgress(msg.progress || 0)
        }
        if (msg.type === "complete" || msg.type === "error") {
          loadAnalyses()
          setUploading(false)
        }
      })

      loadAnalyses()
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`)
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this analysis?")) return
    try {
      await apiFetch(`/api/v1/analyses/${id}`, { method: "DELETE" })
      loadAnalyses()
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" }
      case "failed":
        return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" }
      default:
        return { icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10" }
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Upload and analyze Windows Event Logs with AI-powered threat detection
          </p>
        </div>

        {/* Upload Zone */}
        <UploadZone
          onUpload={handleUpload}
          uploading={uploading}
          progress={uploadProgress}
        />

        {/* Previous Analyses */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-4">Previous Analyses</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 bg-zinc-900 border border-zinc-800" style={{ borderRadius: "6px" }}>
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 border border-zinc-800" style={{ borderRadius: "6px" }}>
              <BarChart3 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">No analyses yet. Upload a CSV file to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis, index) => {
                const statusConfig = getStatusConfig(analysis.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => {
                      if (analysis.status === "completed") {
                        router.push(`/analysis/${analysis.id}`)
                      }
                    }}
                    className={cn(
                      "bg-zinc-900 border border-zinc-800 p-4 transition-colors duration-150",
                      analysis.status === "completed"
                        ? "cursor-pointer hover:border-zinc-700"
                        : "cursor-default"
                    )}
                    style={{ borderRadius: "6px" }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div className={cn("w-10 h-10 flex items-center justify-center", statusConfig.bg)} style={{ borderRadius: "6px" }}>
                        <StatusIcon className={cn("w-5 h-5", statusConfig.color, analysis.status !== "completed" && analysis.status !== "failed" && "animate-spin")} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{analysis.filename}</p>
                        <p className="text-xs text-zinc-500">
                          {formatBytes(analysis.file_size_bytes)} · {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Stats or Progress */}
                      {analysis.status === "completed" ? (
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-sm font-medium text-white">{analysis.total_findings}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500">findings</p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "text-sm font-bold",
                              (analysis.risk_score || 0) >= 0.8 ? "text-red-400" :
                              (analysis.risk_score || 0) >= 0.5 ? "text-orange-400" : "text-green-400"
                            )}>
                              {Math.round((analysis.risk_score || 0) * 100)}%
                            </span>
                            <p className="text-[10px] text-zinc-500">risk</p>
                          </div>
                        </div>
                      ) : analysis.status === "failed" ? (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1" style={{ borderRadius: "4px" }}>
                          Failed
                        </span>
                      ) : (
                        <div className="w-24">
                          <div className="h-1.5 bg-zinc-800 overflow-hidden" style={{ borderRadius: "4px" }}>
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${analysis.progress}%`, borderRadius: "4px" }}
                            />
                          </div>
                          <p className="text-[10px] text-zinc-500 text-center mt-1">{analysis.progress}%</p>
                        </div>
                      )}

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(analysis.id)
                        }}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        style={{ borderRadius: "6px" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

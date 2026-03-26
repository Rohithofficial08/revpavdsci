import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Loader2, Activity, AlertTriangle, BarChart3, GitBranch } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import StatCard from "@/components/dashboard/StatCard"
import ThreatLevel from "@/components/dashboard/ThreatLevel"
import FindingsTable from "@/components/dashboard/findings/FindingsTable"
import AttackChains from "@/components/dashboard/attack-chains/AttackChains"
import Charts from "@/components/dashboard/Charts"
import { apiFetch } from "@/lib/api"

interface Analysis {
  id: string
  filename: string
  status: string
  progress: number
  total_events: number
  total_findings: number
  total_anomalies: number
  total_attack_chains: number
  risk_score: number
  created_at: string
}

interface FindingStats {
  total: number
  by_severity: Record<string, number>
  by_type: Record<string, number>
}

interface Finding {
  id: string
  severity: string
  title: string
  detection_type: string
  rule_id?: string
  mitre_techniques?: string[]
  affected_users?: string[]
}

interface Chain {
  id: string
  chain_index: number
  title: string
  chain_confidence: number
  kill_chain_phases: string[]
  affected_users: string[]
  affected_hosts: string[]
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#6b7280",
}

const TYPE_LABELS: Record<string, string> = {
  rule: "Rule-Based",
  ml_anomaly: "ML Anomaly",
  impossible_travel: "Travel",
}

export default function DashboardPage() {
  const router = useRouter()
  const { id } = router.query
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [stats, setStats] = useState<FindingStats | null>(null)
  const [findings, setFindings] = useState<Finding[]>([])
  const [chains, setChains] = useState<Chain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [analysisData, statsData, findingsData, chainsData] = await Promise.all([
        apiFetch(`/api/v1/analyses/${id}`),
        apiFetch(`/api/v1/analyses/${id}/findings/stats`),
        apiFetch(`/api/v1/analyses/${id}/findings?limit=10`),
        apiFetch(`/api/v1/analyses/${id}/chains`),
      ])
      setAnalysis(analysisData)
      setStats(statsData)
      setFindings(findingsData.data || [])
      setChains(chainsData.data || [])
    } catch (err) {
      console.error("Failed to load:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout analysisId={id as string}>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!analysis) {
    return (
      <DashboardLayout analysisId={id as string}>
        <p className="text-zinc-400">Analysis not found</p>
      </DashboardLayout>
    )
  }

  const severityData = stats
    ? Object.entries(stats.by_severity).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: SEVERITY_COLORS[name] || "#6b7280",
      }))
    : []

  const typeData = stats
    ? Object.entries(stats.by_type).map(([name, value]) => ({
        name: TYPE_LABELS[name] || name,
        value,
      }))
    : []

  const riskScore = Math.round((analysis.risk_score || 0) * 100)
  const threatLevel = riskScore >= 80 ? "CRITICAL" : riskScore >= 50 ? "HIGH" : riskScore >= 20 ? "MEDIUM" : "LOW"

  return (
    <DashboardLayout analysisId={analysis.id}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Overview</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {analysis.filename} · {new Date(analysis.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events"
            value={analysis.total_events || 0}
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Findings"
            value={analysis.total_findings || 0}
            icon={AlertTriangle}
            color="orange"
          />
          <StatCard
            title="ML Anomalies"
            value={analysis.total_anomalies || 0}
            icon={BarChart3}
            color="purple"
          />
          <StatCard
            title="Attack Chains"
            value={analysis.total_attack_chains || 0}
            icon={GitBranch}
            color="red"
          />
        </div>

        {/* Threat Level */}
        <ThreatLevel score={riskScore} threatLevel={threatLevel} />

        {/* Charts */}
        <Charts severityData={severityData} typeData={typeData} />

        {/* Findings & Chains */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FindingsTable
            findings={findings}
            onViewAll={() => router.push(`/analysis/${id}/findings`)}
          />
          <AttackChains
            chains={chains}
            onViewAll={() => router.push(`/analysis/${id}/chains`)}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

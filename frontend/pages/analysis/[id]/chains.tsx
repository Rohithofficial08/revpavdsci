import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { GitBranch } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import ChainStats from "@/components/dashboard/attack-chains/ChainStats"
import ChainCard from "@/components/dashboard/attack-chains/ChainCard"
import ChainDetail from "@/components/dashboard/attack-chains/ChainDetail"
import AnimatedGraphSection from "@/components/dashboard/attack-chains/AnimatedGraphSection"
import EmptyState from "@/components/dashboard/EmptyState"
import { ChainsPageSkeleton } from "@/components/dashboard/attack-chains/ChainSkeletons"
import { apiFetch } from "@/lib/api"

interface Chain {
  id: string
  chain_index: number
  title: string
  summary?: string
  chain_confidence: number
  kill_chain_phases: string[]
  affected_users: string[]
  affected_hosts: string[]
  session_duration_minutes?: number
  first_event_time?: string
  last_event_time?: string
}

export default function AttackChainsPage() {
  const router = useRouter()
  const { id } = router.query
  const [chains, setChains] = useState<Chain[]>([])
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadChains()
  }, [id])

  const loadChains = async () => {
    setLoading(true)
    try {
      const data = await apiFetch(`/api/v1/analyses/${id}/chains`)
      const chainData = data.data || []
      setChains(chainData)
      if (chainData.length > 0) {
        setSelectedChain(chainData[0])
      }
    } catch (err) {
      console.error("Failed to load chains:", err)
    } finally {
      setLoading(false)
    }
  }

  const avgConfidence = chains.length > 0
    ? chains.reduce((sum, c) => sum + c.chain_confidence, 0) / chains.length
    : 0

  const allUsers = new Set(chains.flatMap(c => c.affected_users))
  const allPhases = new Set(chains.flatMap(c => c.kill_chain_phases))

  if (loading) {
    return (
      <DashboardLayout analysisId={id as string}>
        <ChainsPageSkeleton />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout analysisId={id as string}>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 flex items-center justify-center" style={{ borderRadius: "6px" }}>
              <GitBranch className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Attack Chains</h1>
              <p className="text-xs text-zinc-500">
                {chains.length} chain{chains.length !== 1 ? "s" : ""} identified
              </p>
            </div>
          </div>
        </motion.div>

        {chains.length === 0 ? (
          <EmptyState
            type="no-findings"
            title="No Attack Chains"
            description="No correlated attack patterns were detected. This could mean attacks were isolated or no correlation was found."
          />
        ) : (
          <>
            {/* Stats */}
            <ChainStats
              totalChains={chains.length}
              avgConfidence={avgConfidence}
              totalUsers={allUsers.size}
              totalPhases={allPhases.size}
            />

            {/* Split View */}
            <div className="grid grid-cols-2 gap-4" style={{ minHeight: "450px" }}>
              {/* Chain List */}
              <div className="space-y-3 overflow-y-auto scrollbar-thin pr-1 max-h-[500px]">
                {chains.map((chain, index) => (
                  <ChainCard
                    key={chain.id}
                    chain={chain}
                    selected={selectedChain?.id === chain.id}
                    onClick={() => setSelectedChain(chain)}
                    index={index}
                  />
                ))}
              </div>

              {/* Chain Detail */}
              {selectedChain ? (
                <ChainDetail chain={selectedChain} analysisId={id as string} />
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 flex items-center justify-center" style={{ borderRadius: "6px" }}>
                  <p className="text-sm text-zinc-500">Select a chain to view details</p>
                </div>
              )}
            </div>

            {/* Live Attack Graph */}
            <AnimatedGraphSection
              analysisId={id as string}
              chainId={selectedChain?.id || null}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

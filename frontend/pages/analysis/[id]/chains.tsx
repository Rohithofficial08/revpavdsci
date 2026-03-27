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
import { getScanChains, getScanTravels } from "@/lib/api"

interface Travel {
  travel_id: string
  user_account: string
  host_a: string
  time_a: string
  host_b: string
  time_b: string
  gap_minutes: number
}

interface Chain {
  id: string
  chain_id: string
  chain_index: number
  title: string
  computer: string
  chain_confidence: number
  kill_chain_phases: string[]
  affected_users: string[]
  affected_hosts: string[]
}

export default function AttackChainsPage() {
  const router = useRouter()
  const { id } = router.query
  const [chains, setChains] = useState<Chain[]>([])
  const [travels, setTravels] = useState<Travel[]>([])
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadChains()
  }, [id])

  const loadChains = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [chainsRes, travelsRes] = await Promise.all([
        getScanChains(id as string),
        getScanTravels(id as string)
      ])

      const chainData = (chainsRes.chains || []).map((ch: any, idx: number) => {
        // Parse the sequence string into individual steps for UI
        const steps = ch.chain_sequence.split(" → ")
        
        return {
          id: ch.chain_id,
          chain_id: ch.chain_id,
          chain_index: idx + 1,
          title: ch.chain_sequence,
          computer: ch.computer,
          chain_confidence: 0.9,
          kill_chain_phases: steps.map((s: string) => s.replace(/\[.*\]/, "").trim()),
          affected_users: [],
          affected_hosts: [ch.computer]
        }
      })
      
      setChains(chainData)
      setTravels(travelsRes.travels || [])

      if (chainData.length > 0) {
        setSelectedChain(chainData[0])
      }
    } catch (err) {
      console.error("Failed to load chains/travels:", err)
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
              // @ts-ignore - Adding extra prop for visual info
              totalTravels={travels.length}
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
              selectedChain={selectedChain || null}
            />

            {/* Travel Anomalies Section */}
            {travels.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 p-5 mt-6"
                style={{ borderRadius: "6px" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Travel Alerts (Impossible Velocity)</h3>
                </div>
                <div className="space-y-3">
                  {travels.map((travel) => (
                    <div 
                      key={travel.travel_id}
                      className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
                      style={{ borderRadius: "4px" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-xs">
                          <p className="text-zinc-500">User</p>
                          <p className="text-zinc-200 font-medium">{travel.user_account}</p>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div className="text-xs">
                          <p className="text-zinc-500">Host A ({new Date(travel.time_a).toLocaleTimeString()})</p>
                          <p className="text-zinc-200">{travel.host_a}</p>
                        </div>
                        <div className="text-zinc-600 text-[10px] mx-1">➜</div>
                        <div className="text-xs">
                          <p className="text-zinc-500">Host B ({new Date(travel.time_b).toLocaleTimeString()})</p>
                          <p className="text-zinc-200">{travel.host_b}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-500 uppercase">Gap</p>
                        <p className="text-xs text-red-400 font-bold">{travel.gap_minutes} mins</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

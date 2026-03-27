import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

type Analysis = {
  id: string
  filename: string
  file_size_bytes?: number
  status: string
  progress: number
  total_events: number
  total_findings: number
  total_anomalies: number
  total_attack_chains: number
  risk_score: number
  created_at: string
}

// shared in-memory stores
const analyses: Analysis[] = (global as any).__mock_analyses || []
;(global as any).__mock_analyses = analyses

const findingsMap: Record<string, any[]> = (global as any).__mock_findings || {}
;(global as any).__mock_findings = findingsMap

const chainsMap: Record<string, any[]> = (global as any).__mock_chains || {}
;(global as any).__mock_chains = chainsMap

function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' })

  const { filename = 'upload.csv', size = 0 } = req.body || {}

  const id = crypto.randomBytes(6).toString('hex')
  const created_at = new Date().toISOString()

  // simple seeded generation so results vary a bit
  const rng = seededRandom(Date.now() % 100000)
  const total_events = randInt(rng, 500, 5000)
  const total_findings = Math.max(0, Math.floor(total_events * (0.01 + rng() * 0.1)))
  const total_anomalies = Math.max(0, Math.floor(total_events * (0.005 + rng() * 0.02)))
  const total_attack_chains = Math.max(0, Math.floor(total_findings * (0.005 + rng() * 0.03)))
  const risk_score = Math.min(0.99, (total_findings / Math.max(1, total_events)) + rng() * 0.4)

  const analysis: Analysis = {
    id,
    filename,
    file_size_bytes: size,
    status: 'completed',
    progress: 100,
    total_events,
    total_findings,
    total_anomalies,
    total_attack_chains,
    risk_score,
    created_at,
  }

  analyses.push(analysis)

  // generate findings
  const severities = ['critical', 'high', 'medium', 'low']
  const findings = new Array(total_findings).fill(0).map((_, i) => ({
    id: `${id}-f-${i + 1}`,
    severity: severities[Math.floor(rng() * severities.length)],
    title: `Detection ${i + 1}`,
    detection_type: i % 5 === 0 ? 'ml_anomaly' : 'rule',
    rule_id: `R-${randInt(rng, 1000, 9999)}`,
    mitre_techniques: ['T1059', 'T1078'].slice(0, randInt(rng, 0, 2)),
    affected_users: ['alice', 'bob', 'carol'].slice(0, randInt(rng, 1, 3)),
  }))

  findingsMap[id] = findings

  // generate chains
  const chains = new Array(total_attack_chains).fill(0).map((_, i) => ({
    id: `${id}-c-${i + 1}`,
    chain_index: i + 1,
    title: `Attack Chain ${i + 1}`,
    chain_confidence: parseFloat((rng()).toFixed(2)),
    kill_chain_phases: ['reconnaissance', 'execution', 'exfiltration'].slice(0, randInt(rng, 1, 3)),
    affected_users: ['alice', 'bob'].slice(0, randInt(rng, 1, 2)),
    affected_hosts: [`host-${randInt(rng,1,10)}`],
  }))

  chainsMap[id] = chains

  return res.status(200).json({ id })
}

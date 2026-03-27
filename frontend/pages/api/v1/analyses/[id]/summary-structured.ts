import { NextApiRequest, NextApiResponse } from 'next'

const analyses: any[] = (global as any).__mock_analyses || []
const findingsMap: Record<string, any[]> = (global as any).__mock_findings || {}
const chainsMap: Record<string, any[]> = (global as any).__mock_chains || {}

function topCounts<T extends string>(arr: T[]) {
  const counts: Record<string, number> = {}
  arr.forEach((v) => (counts[v] = (counts[v] || 0) + 1))
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ key: k, count: v }))
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ detail: 'Invalid id' })

  const analysis = analyses.find((a) => a.id === id)
  if (!analysis) return res.status(404).json({ detail: 'Not found' })

  const findings = findingsMap[id] || []
  const chains = chainsMap[id] || []

  const overview = {
    analysisId: analysis.id,
    filename: analysis.filename,
    total_events: analysis.total_events || 0,
    total_findings: findings.length,
    total_attack_chains: chains.length,
    risk_score: Math.round((analysis.risk_score || 0) * 100),
  }

  const top_findings = findings.slice(0, 10).map((f: any) => ({ id: f.id, title: f.title, severity: f.severity, type: f.detection_type }))

  const top_severities = topCounts(findings.map((f) => f.severity || 'medium')).slice(0, 5)
  const top_types = topCounts(findings.map((f) => f.detection_type || 'rule')).slice(0, 5)

  const sample_chains = chains.slice(0, 5).map((c: any) => ({ id: c.id, title: c.title, confidence: c.chain_confidence }))

  const suggested_actions = [] as string[]
  if (top_severities.find((s) => s.key === 'critical')) suggested_actions.push('Immediately investigate critical findings and isolate affected hosts.')
  if (top_types.find((t) => t.key === 'ml_anomaly')) suggested_actions.push('Review ML anomaly details and validate with contextual logs.')
  if (analysis.total_attack_chains && analysis.total_attack_chains > 0) suggested_actions.push('Prioritize attack chain containment and remediation.')
  if (suggested_actions.length === 0) suggested_actions.push('Perform standard triage on high-severity findings.')

  const structured = {
    overview,
    top_findings,
    top_severities,
    top_types,
    sample_chains,
    suggested_actions,
    note: 'This structured summary is synthetic and intended for demonstration.'
  }

  res.status(200).json(structured)
}

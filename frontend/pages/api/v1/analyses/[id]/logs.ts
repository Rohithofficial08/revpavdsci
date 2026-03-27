import { NextApiRequest, NextApiResponse } from 'next'

const findingsMap: Record<string, any[]> = (global as any).__mock_findings || {}

function sample<T>(arr: T[], n: number, rng: () => number) {
  const res: T[] = []
  for (let i = 0; i < n; i++) {
    if (arr.length === 0) break
    res.push(arr[Math.floor(rng() * arr.length)])
  }
  return res
}

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ detail: 'Invalid id' })

  const { limit = '10' } = req.query as Record<string, string>
  const l = Math.max(1, Math.min(1000, parseInt(limit, 10) || 10))

  const findings = findingsMap[id] || []

  const rng = seededRandom(Date.now() % 100000)

  if (findings.length === 0) {
    // generate synthetic logs
    const logs = new Array(l).fill(0).map((_, i) => ({
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - i * 1000 * 60).toISOString(),
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(rng() * 4)],
      source: `sensor-${Math.floor(rng() * 10) + 1}`,
      message: `Synthetic event ${i + 1}`,
    }))

    return res.status(200).json({ total: logs.length, logs })
  }

  const sampled = sample(findings, l, rng)
  const logs = sampled.map((f, i) => ({
    id: `${id}-log-${i + 1}`,
    timestamp: new Date(Date.now() - i * 1000 * 30).toISOString(),
    severity: f.severity || 'medium',
    source: f.rule_id || f.detection_type || 'ingest',
    message: f.title || `Detection ${i + 1}`,
  }))

  res.status(200).json({ total: logs.length, logs })
}

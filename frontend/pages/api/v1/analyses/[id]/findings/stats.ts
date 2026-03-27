import { NextApiRequest, NextApiResponse } from 'next'

const findingsMap: Record<string, any[]> = (global as any).__mock_findings || {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ detail: 'Invalid id' })

  const data = findingsMap[id] || []
  const by_severity: Record<string, number> = {}
  const by_type: Record<string, number> = {}
  data.forEach((f) => {
    by_severity[f.severity] = (by_severity[f.severity] || 0) + 1
    by_type[f.detection_type] = (by_type[f.detection_type] || 0) + 1
  })

  return res.status(200).json({ total: data.length, by_severity, by_type })
}

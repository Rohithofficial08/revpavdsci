import { NextApiRequest, NextApiResponse } from 'next'

const findingsMap: Record<string, any[]> = (global as any).__mock_findings || {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ detail: 'Invalid id' })

  const data = findingsMap[id] || []
  const { limit = '10' } = req.query as Record<string, string>
  const l = Math.max(1, Math.min(1000, parseInt(limit, 10) || 10))

  return res.status(200).json({ data: data.slice(0, l) })
}

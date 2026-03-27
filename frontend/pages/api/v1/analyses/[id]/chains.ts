import { NextApiRequest, NextApiResponse } from 'next'

const chainsMap: Record<string, any[]> = (global as any).__mock_chains || {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ detail: 'Invalid id' })

  const data = chainsMap[id] || []
  return res.status(200).json({ data })
}

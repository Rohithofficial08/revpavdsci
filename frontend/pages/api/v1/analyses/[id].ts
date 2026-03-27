import { NextApiRequest, NextApiResponse } from 'next'

const analyses: any[] = (global as any).__mock_analyses || []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ detail: 'Invalid id' })

  const found = analyses.find((a) => a.id === id)
  if (!found) return res.status(404).json({ detail: 'Not found' })

  return res.status(200).json(found)
}

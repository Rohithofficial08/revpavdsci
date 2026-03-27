import { NextApiRequest, NextApiResponse } from 'next'

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

// In-memory store persisted across requests while server is running
const analyses: Analysis[] = (global as any).__mock_analyses || [];
(global as any).__mock_analyses = analyses;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ data: analyses.slice().reverse() })
  }

  res.status(405).json({ detail: 'Method not allowed' })
}

<<<<<<< Updated upstream
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
=======
<<<<<<< Updated upstream
// Updated to use LogSentinal SOC Microservice — Root Endpoints
const API_URL = "/api/proxy"
const DEFAULT_USER_ID = "356721c8-1559-4c00-9aec-8be06d861028"
=======
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
>>>>>>> Stashed changes
>>>>>>> Stashed changes

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(error.detail || "Request failed")
  }

  return res.json()
}

<<<<<<< Updated upstream
export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_URL}/api/v1/analyses/upload`, {
=======
<<<<<<< Updated upstream
/**
 * POST /upload
 */
export async function uploadFile(file: File, userId: string = DEFAULT_USER_ID) {
  const formData = new FormData()
  formData.append("file", file)

  // Specification: /upload?user_id={userId}&persist_db=true
  const res = await fetch(`${API_URL}/upload?user_id=${userId}&persist_db=true`, {
=======
export async function uploadFile(file: File) {
  // Send a lightweight JSON payload so the local mock API can process uploads
  const res = await fetch(`${API_URL}/api/v1/analyses/upload`, {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename: file.name, size: file.size }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Upload failed" }))
    throw new Error(error.detail || "Upload failed")
  }

  return res.json()
}

export function connectWebSocket(analysisId: string, onMessage: (data: any) => void) {
  const wsUrl = API_URL.replace("http", "ws")
  const ws = new WebSocket(`${wsUrl}/api/v1/ws/analyses/${analysisId}`)

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }

  ws.onerror = () => {
    console.error("WebSocket error")
  }

  return ws
}

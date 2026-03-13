const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

export async function getHealthAdvice(userData) {
  const res = await fetch(`${API_BASE}/api/advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userData }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || '请求失败')
  }
  return res.json()
}

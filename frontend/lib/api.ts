const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${API_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  const json = await res.json()
  return json.data as T
}

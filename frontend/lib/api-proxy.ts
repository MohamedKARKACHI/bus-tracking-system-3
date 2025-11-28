const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'

// Helper to proxy requests to backend
export async function proxyToBackend(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BACKEND_URL}${endpoint}`
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

// Helper to forward request with auth token
export async function proxyAuthRequest(
  endpoint: string,
  request: Request,
  options: RequestInit = {}
): Promise<Response> {
  const authHeader = request.headers.get('authorization')
  
  return proxyToBackend(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(authHeader && { Authorization: authHeader }),
    },
  })
}

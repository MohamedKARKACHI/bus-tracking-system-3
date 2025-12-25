const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

/**
 * Get API URL with proper base
 */
export function getApiUrl(endpoint: string) {
  return `${API_BASE_URL}${endpoint}`
}

/**
 * Wrapper for fetch that automatically prefixes backend API URL
 */
export async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = getApiUrl(endpoint)
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  return response
}

/**
 * Authenticated API request with JWT token
 */
export async function authenticatedRequest(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token')
  
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
}

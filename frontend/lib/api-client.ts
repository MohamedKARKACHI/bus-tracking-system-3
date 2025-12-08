const getAuthHeader = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        return token ? { 'Authorization': `Bearer ${token}` } : {}
    }
    return {}
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
    }

    const response = await fetch(url, {
        ...options,
        headers,
    })

    // Handle 401 Unauthorized implicitly if needed, or just return response
    if (response.status === 401) {
        // Optional: Redirect to login or clear token?
        // For now, let the caller handle it, or we can emit an event.
    }

    return response
}

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const getAuthToken = () => {
  try {
    return localStorage.getItem('navchetnaToken') || null
  } catch {
    return null
  }
}

export const resolveMediaUrl = (path) => {
  if (!path || typeof path !== 'string') return ''

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`

  if (API_BASE_URL) {
    return `${API_BASE_URL}${normalized}`
  }

  return normalized
}

export const fetchApi = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers = {
    ...options.headers,
  }

  const token = getAuthToken()
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data?.message || data?.error)) ||
        `Request failed with status ${response.status}`
      const error = new Error(errorMessage)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    // Network or server errors
    if (!err.status) {
      console.warn(`[API Network Error] ${url}:`, err.message)
    }
    throw err
  }
}

export const uploadMediaApi = async (imageDataUrl) => {
  try {
    const result = await fetchApi('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image: imageDataUrl }),
    })
    return result
  } catch (err) {
    console.error('Failed to upload media:', err)
    throw err
  }
}

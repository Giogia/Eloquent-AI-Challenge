
export async function signup(username: string, email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
  
    const tokens = await response.json()
    
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)

    return tokens
  } 
  catch (error) {
    console.error('Error signing up:', error)
    return null
  }
}

export async function login(email: string, password: string) {
  try {    
    const formData = new FormData()

    formData.append('username', email)
    formData.append('password', password)
  
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      body: formData,
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }
  
    const tokens = await response.json()

    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)

    return tokens
  }
  catch (error) {
    console.error('Error logging in:', error)
    return null
  }
}

export async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
  
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
  
    const tokens = await response.json()
    localStorage.setItem('access_token', tokens.access_token)

    return tokens.access_token
  }
  catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
